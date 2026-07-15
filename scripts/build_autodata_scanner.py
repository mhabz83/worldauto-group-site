"""Build the AutoData inspection-lane destination from the CC-BY scanner model.

Run with Blender:
    blender -b --python scripts/build_autodata_scanner.py -- \
      /path/to/Hoop.gltf /tmp/autodata-scanner.glb /tmp/autodata-scanner.png

Source model: "Vehicle scanner" by harikumar3d, licensed CC BY 4.0.
https://sketchfab.com/3d-models/vehicle-scanner-fc309406a96c4eb1b72aeaf2c540b444

The source is a mobile scanner rather than a complete drive-through portal.
This assembly uses two cleaned scanner stations inside a purpose-built vehicle
inspection lane, while keeping the downloaded geometry visibly present.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

import bpy
from mathutils import Matrix, Vector


ARGS = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
if len(ARGS) < 2:
    raise SystemExit("Expected: <scanner.gltf> <output.glb> [preview.png]")

SOURCE = Path(ARGS[0])
OUTPUT = Path(ARGS[1])
PREVIEW = Path(ARGS[2]) if len(ARGS) > 2 else None


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)


def material(name: str, color: tuple[float, float, float, float]) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = color
    mat.metallic = 0.0
    mat.roughness = 0.92
    return mat


def box(
    name: str,
    size: tuple[float, float, float],
    location: tuple[float, float, float],
    mat: bpy.types.Material,
    bevel: float = 0.04,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        modifier = obj.modifiers.new("Inspection edge", "BEVEL")
        modifier.width = bevel
        modifier.segments = 1
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.data.materials.append(mat)
    return obj


def bounds(objects: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    points = [obj.matrix_world @ Vector(corner) for obj in objects for corner in obj.bound_box]
    return (
        Vector((min(p.x for p in points), min(p.y for p in points), min(p.z for p in points))),
        Vector((max(p.x for p in points), max(p.y for p in points), max(p.z for p in points))),
    )


def bake_world(obj: bpy.types.Object) -> None:
    world = obj.matrix_world.copy()
    obj.parent = None
    obj.matrix_world = world
    obj.data.transform(obj.matrix_world)
    obj.data.update()
    obj.matrix_world = Matrix.Identity(4)


def import_scanner_source(mat: bpy.types.Material) -> list[bpy.types.Object]:
    bpy.ops.import_scene.gltf(filepath=str(SOURCE))
    bpy.context.view_layer.update()
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]

    # The download includes a 7.6 m ground plane, a rendered scan cone and
    # highly tessellated caster wheels. They are presentation effects, not the
    # scanner silhouette, and create dense web edges, so remove them.
    kept: list[bpy.types.Object] = []
    for obj in meshes:
        if obj.name == "Cone" or obj.name == "Plane.005" or obj.name.startswith("Cylinder"):
            bpy.data.objects.remove(obj, do_unlink=True)
            continue
        bake_world(obj)
        obj.data.materials.clear()
        obj.data.materials.append(mat)
        kept.append(obj)
    bpy.context.view_layer.update()
    return kept


def make_scanner_station(
    source_meshes: list[bpy.types.Object],
    name: str,
    location: tuple[float, float, float],
    rotation_z: float,
    mirror_x: bool = False,
) -> bpy.types.Object:
    low, high = bounds(source_meshes)
    source_height = max(high.z - low.z, 0.001)
    source_center = (low + high) * 0.5
    scale = 2.55 / source_height

    root = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(root)
    root.location = location
    root.rotation_euler.z = rotation_z
    root.scale = ((-scale if mirror_x else scale), scale, scale)

    for source_obj in source_meshes:
        obj = source_obj.copy()
        obj.data = source_obj.data
        bpy.context.scene.collection.objects.link(obj)
        obj.name = f"{name}_{source_obj.name}"
        obj.hide_render = False
        obj.hide_viewport = False
        obj.parent = root
        obj.matrix_parent_inverse = Matrix.Identity(4)
        obj.matrix_basis = Matrix.Translation((-source_center.x, -source_center.y, -low.z))
    return root


def setup_preview() -> None:
    if PREVIEW is None:
        return
    world = bpy.data.worlds.new("AutoData Preview")
    bpy.context.scene.world = world
    world.color = (0.002, 0.006, 0.025)

    camera_data = bpy.data.cameras.new("Camera")
    camera = bpy.data.objects.new("Camera", camera_data)
    bpy.context.scene.collection.objects.link(camera)
    camera.location = (12.5, -16.5, 9.0)
    camera.rotation_euler = (Vector((0, 2.6, 1.8)) - camera.location).to_track_quat("-Z", "Y").to_euler()
    camera_data.lens = 58
    bpy.context.scene.camera = camera

    key_data = bpy.data.lights.new("Key", "AREA")
    key_data.energy = 1500
    key_data.size = 11
    key = bpy.data.objects.new("Key", key_data)
    bpy.context.scene.collection.objects.link(key)
    key.location = (-5, -7, 12)

    rim_data = bpy.data.lights.new("Cyan rim", "AREA")
    rim_data.energy = 1100
    rim_data.color = (0.05, 0.55, 1.0)
    rim_data.size = 8
    rim = bpy.data.objects.new("Cyan rim", rim_data)
    bpy.context.scene.collection.objects.link(rim)
    rim.location = (8, 5, 7)

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1440
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(PREVIEW)
    scene.view_settings.look = "AgX - Medium High Contrast"
    bpy.ops.render.render(write_still=True)


clear_scene()
MATTE = material("WAG_MatteBlack", (0.003, 0.008, 0.022, 1.0))
SENSOR = material("WAG_Sensor", (0.008, 0.06, 0.18, 1.0))
source_meshes = import_scanner_source(SENSOR)

# Hide the source geometry after creating linked station instances.
for source_obj in source_meshes:
    source_obj.hide_render = True
    source_obj.hide_viewport = True

export_roots: list[bpy.types.Object] = []

# Two sequential portals create a real drive-through inspection volume.
portal_width = 5.2
portal_height = 4.25
for portal_index, y in enumerate((0.0, 4.4), start=1):
    export_roots.extend([
        box(f"AD_portal_{portal_index}_left", (0.42, 0.54, portal_height), (-portal_width * 0.5, y, portal_height * 0.5), MATTE, 0.06),
        box(f"AD_portal_{portal_index}_right", (0.42, 0.54, portal_height), (portal_width * 0.5, y, portal_height * 0.5), MATTE, 0.06),
        box(f"AD_portal_{portal_index}_header", (portal_width + 0.42, 0.54, 0.48), (0, y, portal_height), MATTE, 0.06),
    ])
    # Three compact overhead sensor blocks break the header into readable
    # inspection hardware instead of a generic doorway.
    for sensor_index, x in enumerate((-1.45, 0.0, 1.45), start=1):
        export_roots.append(box(
            f"AD_overhead_sensor_{portal_index}_{sensor_index}",
            (0.54, 0.76, 0.28),
            (x, y - 0.08, portal_height - 0.44),
            SENSOR,
            0.08,
        ))

# Long roof rails and a recessed inspection lane make the two portals one
# coherent scanner tunnel.
export_roots.extend([
    box("AD_roof_rail_left", (0.14, 5.15, 0.14), (-2.18, 2.2, 4.05), SENSOR, 0.035),
    box("AD_roof_rail_right", (0.14, 5.15, 0.14), (2.18, 2.2, 4.05), SENSOR, 0.035),
    box("AD_inspection_slab", (4.7, 8.2, 0.12), (0, 2.9, -0.06), MATTE, 0.04),
    box("AD_lane_left", (0.13, 8.8, 0.08), (-1.18, 2.6, 0.04), SENSOR, 0.025),
    box("AD_lane_right", (0.13, 8.8, 0.08), (1.18, 2.6, 0.04), SENSOR, 0.025),
    box("AD_inspection_pit", (1.7, 4.8, 0.10), (0, 2.35, 0.01), SENSOR, 0.08),
])

# The downloaded CC-BY scanner stations remain the distinctive functional cue.
export_roots.extend([
    make_scanner_station(source_meshes, "AD_scanner_left", (-2.08, 2.15, 0.0), math.radians(-90)),
    make_scanner_station(source_meshes, "AD_scanner_right", (2.08, 2.15, 0.0), math.radians(90), mirror_x=True),
])

bpy.ops.object.select_all(action="DESELECT")
for root in export_roots:
    root.select_set(True)
    for child in root.children_recursive:
        child.select_set(True)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=str(OUTPUT),
    export_format="GLB",
    use_selection=True,
    export_materials="EXPORT",
    export_cameras=False,
    export_lights=False,
    export_texcoords=False,
    export_normals=True,
    export_tangents=False,
    export_attributes=False,
    export_extras=False,
    export_yup=True,
    export_apply=True,
)

setup_preview()

meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH" and not obj.hide_render]
print(
    "AUTODATA_EXPORT",
    f"output={OUTPUT}",
    f"meshes={len(meshes)}",
    f"triangles={sum(sum(max(0, len(p.vertices) - 2) for p in obj.data.polygons) for obj in meshes)}",
)

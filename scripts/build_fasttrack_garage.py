"""Assemble a restrained three-bay FastTrack service garage for the WebGL journey.

Run with Blender:
    blender -b --python scripts/build_fasttrack_garage.py -- \
      "/path/to/Modular - Car Service Garage & Parking (.FBX)" \
      "/tmp/fasttrack-service.glb" "/tmp/fasttrack-service.png"

The purchased kit is modular rather than a complete scene. This script uses its
real workshop equipment inside a deliberately simple architectural shell so the
runtime can extract clean feature edges without turning the destination into a
dense triangulated wireframe.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

import bpy
from mathutils import Matrix, Vector


def args_after_double_dash() -> list[str]:
    return sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []


ARGS = args_after_double_dash()
if len(ARGS) < 2:
    raise SystemExit("Expected: <fbx-directory> <output.glb> [preview.png]")

SOURCE = Path(ARGS[0])
OUTPUT = Path(ARGS[1])
PREVIEW = Path(ARGS[2]) if len(ARGS) > 2 else None


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.images):
        for block in list(datablocks):
            if block.users == 0:
                datablocks.remove(block)


def make_material(name: str, color: tuple[float, float, float, float]) -> bpy.types.Material:
    material = bpy.data.materials.new(name)
    material.diffuse_color = color
    material.metallic = 0.0
    material.roughness = 0.9
    return material


MATTE = None
ACCENT = None


def box(
    name: str,
    size: tuple[float, float, float],
    location: tuple[float, float, float],
    bevel: float = 0.045,
    material: bpy.types.Material | None = None,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        modifier = obj.modifiers.new("Architectural edge", "BEVEL")
        modifier.width = bevel
        modifier.segments = 1
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.data.materials.append(material or MATTE)
    return obj


def freeze_world_transform(obj: bpy.types.Object) -> None:
    if obj.type != "MESH":
        return
    obj.data.transform(obj.matrix_world)
    obj.data.update()
    obj.matrix_world = Matrix.Identity(4)


def mesh_bounds(objects: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    corners = [obj.matrix_world @ Vector(corner) for obj in objects for corner in obj.bound_box]
    return (
        Vector((min(p.x for p in corners), min(p.y for p in corners), min(p.z for p in corners))),
        Vector((max(p.x for p in corners), max(p.y for p in corners), max(p.z for p in corners))),
    )


def import_prop(
    filename: str,
    name: str,
    location: tuple[float, float, float],
    target_height: float,
    rotation_z: float = 0.0,
) -> bpy.types.Object:
    before = set(bpy.context.scene.objects)
    bpy.ops.import_scene.fbx(filepath=str(SOURCE / filename), use_anim=False)
    imported = [obj for obj in bpy.context.scene.objects if obj not in before]
    all_meshes = [obj for obj in imported if obj.type == "MESH"]
    # Several kit modules bundle LOD0/1/2 in one FBX. Shipping all three would
    # stack duplicate edges and create exactly the fuzzy wireframe we are
    # avoiding, so retain only the authored high-detail LOD0 when present.
    lod0_meshes = [obj for obj in all_meshes if "LOD0" in obj.name.upper()]
    meshes = lod0_meshes or all_meshes
    discarded_meshes = [obj for obj in all_meshes if obj not in meshes]
    helper_empties = [obj for obj in imported if obj.type == "EMPTY"]
    if not meshes:
        raise RuntimeError(f"No meshes imported from {filename}")

    # FBX modules often arrive under transformed helper empties. Detach each
    # mesh while preserving its world matrix before baking; otherwise that
    # inherited transform is applied a second time when we add our own root.
    for obj in meshes:
        world_matrix = obj.matrix_world.copy()
        obj.parent = None
        obj.matrix_world = world_matrix

    for obj in imported:
        if obj in discarded_meshes:
            bpy.data.objects.remove(obj, do_unlink=True)
            continue
        if obj.type == "MESH":
            freeze_world_transform(obj)
            obj.data.materials.clear()
            obj.data.materials.append(MATTE)
        elif obj.type != "EMPTY":
            bpy.data.objects.remove(obj, do_unlink=True)

    bpy.context.view_layer.update()

    low, high = mesh_bounds(meshes)
    height = max(high.z - low.z, 0.001)
    scale = target_height / height
    center = (low + high) * 0.5

    root = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(root)
    root.scale = (scale, scale, scale)
    root.rotation_euler.z = rotation_z
    # Props are centered around their footprint and placed on the floor.
    root.location = location
    for obj in meshes:
        obj.parent = root
        obj.matrix_parent_inverse = Matrix.Identity(4)
        obj.matrix_basis = Matrix.Translation((-center.x, -center.y, -low.z))
        obj.name = f"{name}_{obj.name}"
    for obj in helper_empties:
        if obj.name in bpy.context.scene.objects:
            bpy.data.objects.remove(obj, do_unlink=True)
    return root


def build_architecture() -> list[bpy.types.Object]:
    architecture: list[bpy.types.Object] = []
    width = 16.8
    depth = 7.2
    height = 5.25
    bay_width = 4.55
    post = 0.46
    fascia = 0.58

    # A deep floor plate and back wall make it read as a destination, not a
    # floating icon. The front remains fully open and unmistakably functional.
    architecture.append(box("FT_floor", (width, depth, 0.16), (0, depth * 0.5, -0.08), 0.02))
    architecture.append(box("FT_back_wall", (width, 0.28, height), (0, depth, height * 0.5), 0.035))
    architecture.append(box("FT_left_return", (0.32, depth, height), (-width * 0.5, depth * 0.5, height * 0.5), 0.035))
    architecture.append(box("FT_right_return", (0.32, depth, height), (width * 0.5, depth * 0.5, height * 0.5), 0.035))
    architecture.append(box("FT_canopy", (width, depth, 0.24), (0, depth * 0.5, height + 0.12), 0.05))
    architecture.append(box("FT_fascia", (width + 0.2, fascia, 0.78), (0, -0.10, height - 0.18), 0.06))

    bay_centers = (-bay_width, 0.0, bay_width)
    post_x = (-width * 0.5, -bay_width * 0.5, bay_width * 0.5, width * 0.5)
    for index, x in enumerate(post_x):
        architecture.append(box(f"FT_front_post_{index + 1}", (post, post, height), (x, 0, height * 0.5), 0.055))

    # Interior divisions stop short of the facade and roof, preserving one
    # strong canopy while making three actual service rooms in perspective.
    for index, x in enumerate((-bay_width * 0.5, bay_width * 0.5)):
        architecture.append(box(f"FT_divider_{index + 1}", (0.18, depth - 0.8, 3.4), (x, 3.75, 1.7), 0.025))

    for index, x in enumerate(bay_centers):
        # Bold inner portal and two recessed ceiling rails per bay.
        architecture.append(box(f"FT_bay_header_{index + 1}", (bay_width - post, 0.30, 0.32), (x, 0.18, 4.42), 0.035))
        architecture.append(box(f"FT_ceiling_rail_L_{index + 1}", (0.12, 5.8, 0.12), (x - 1.15, 3.25, 4.72), 0.025))
        architecture.append(box(f"FT_ceiling_rail_R_{index + 1}", (0.12, 5.8, 0.12), (x + 1.15, 3.25, 4.72), 0.025))
        # Recessed inspection/service pit plus strong approach rails.
        architecture.append(box(f"FT_pit_{index + 1}", (2.05, 3.75, 0.10), (x, 3.85, 0.02), 0.10, ACCENT))
        architecture.append(box(f"FT_lane_L_{index + 1}", (0.12, 6.4, 0.07), (x - 1.05, 2.95, 0.04), 0.025, ACCENT))
        architecture.append(box(f"FT_lane_R_{index + 1}", (0.12, 6.4, 0.07), (x + 1.05, 2.95, 0.04), 0.025, ACCENT))
    return architecture


def setup_preview(objects: list[bpy.types.Object]) -> None:
    if PREVIEW is None:
        return
    world = bpy.data.worlds.new("Preview World")
    bpy.context.scene.world = world
    world.color = (0.002, 0.004, 0.02)

    camera_data = bpy.data.cameras.new("Camera")
    camera = bpy.data.objects.new("Camera", camera_data)
    bpy.context.scene.collection.objects.link(camera)
    camera.location = (20.0, -25.0, 14.0)
    direction = Vector((0.0, 3.3, 2.2)) - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    camera_data.lens = 56
    bpy.context.scene.camera = camera

    key_data = bpy.data.lights.new("Key", "AREA")
    key_data.energy = 1600
    key_data.shape = "RECTANGLE"
    key_data.size = 12
    key = bpy.data.objects.new("Key", key_data)
    bpy.context.scene.collection.objects.link(key)
    key.location = (-4, -8, 14)
    key.rotation_euler = (math.radians(28), 0, math.radians(-18))

    fill_data = bpy.data.lights.new("Fill", "AREA")
    fill_data.energy = 900
    fill_data.color = (0.08, 0.28, 1.0)
    fill_data.size = 9
    fill = bpy.data.objects.new("Fill", fill_data)
    bpy.context.scene.collection.objects.link(fill)
    fill.location = (11, 4, 8)

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1440
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(PREVIEW)
    scene.render.film_transparent = False
    scene.view_settings.look = "AgX - Medium High Contrast"
    bpy.ops.render.render(write_still=True)


clear_scene()
MATTE = make_material("WAG_MatteBlack", (0.004, 0.006, 0.018, 1.0))
ACCENT = make_material("WAG_EdgeAccent", (0.01, 0.05, 0.22, 1.0))

export_objects = build_architecture()

# Three real lift systems make the function instantly legible. Supporting kit
# differs per bay so repetition reads as an operating workshop, not a symbol.
for i, x in enumerate((-4.55, 0.0, 4.55), start=1):
    lift = import_prop("Machine_01.fbx", f"FT_lift_{i}", (x, 4.15, 0.0), 3.5)
    export_objects.append(lift)

export_objects.extend([
    import_prop("Machine_02.fbx", "FT_tire_changer", (-6.55, 5.55, 0.0), 1.35, rotation_z=math.radians(-18)),
    import_prop("Machine_03.fbx", "FT_floor_jack", (2.95, 5.6, 0.0), 0.52, rotation_z=math.radians(20)),
    import_prop("Tirerack_01.fbx", "FT_tire_rack", (6.4, 5.55, 0.0), 2.25, rotation_z=math.radians(180)),
])

for root in export_objects:
    meshes = [root] if root.type == "MESH" else [child for child in root.children_recursive if child.type == "MESH"]
    if meshes:
        low, high = mesh_bounds(meshes)
        print("OBJECT_BOUNDS", root.name, tuple(round(v, 3) for v in low), tuple(round(v, 3) for v in high))

# Export only the architectural and equipment hierarchy. Materials are tiny,
# texture-free markers; Three.js replaces them with matte black and neon edges.
bpy.ops.object.select_all(action="DESELECT")
for root in export_objects:
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

setup_preview(export_objects)

mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH" and obj.visible_get()]
print(
    "FASTTRACK_EXPORT",
    f"output={OUTPUT}",
    f"meshes={len(mesh_objects)}",
    f"triangles={sum(len(obj.data.loop_triangles) for obj in mesh_objects)}",
)

"""Prepare the licensed SUV source file as a texture-free web GLB.

Run with Blender:
    blender -b /path/to/suv2.blend --python scripts/export_suv_web.py

The export keeps the body, wheels and brakes as separate named meshes, strips
the photographic textures (the live hero supplies its own neon materials), and
normalizes the vehicle to one unit nose-to-tail with its tyres on the ground.
"""

from pathlib import Path

import bpy
from mathutils import Vector


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT = PROJECT_ROOT / "public" / "webgl-lines" / "suv-licensed.glb"


def mesh_world_bounds(objects: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    corners = [obj.matrix_world @ Vector(corner) for obj in objects for corner in obj.bound_box]
    low = Vector((min(p.x for p in corners), min(p.y for p in corners), min(p.z for p in corners)))
    high = Vector((max(p.x for p in corners), max(p.y for p in corners), max(p.z for p in corners)))
    return low, high


meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
if not meshes:
    raise RuntimeError("The source file contains no mesh objects")

# Remove everything that cannot contribute to the browser vehicle.
for obj in list(bpy.context.scene.objects):
    if obj.type != "MESH":
        bpy.data.objects.remove(obj, do_unlink=True)

# The runtime replaces this material with matte black plus emissive feature
# edges. Keeping the GLB texture-free makes it small and avoids shipping a
# reconstructable photo-texture package with the website.
material = bpy.data.materials.new("WAG_MatteBlack")
material.diffuse_color = (0.002, 0.003, 0.008, 1.0)
material.metallic = 0.0
material.roughness = 0.94
for obj in meshes:
    obj.data.materials.clear()
    obj.data.materials.append(material)
    for polygon in obj.data.polygons:
        polygon.material_index = 0

low, high = mesh_world_bounds(meshes)
length = high.y - low.y
if length <= 0:
    raise RuntimeError("Vehicle length is invalid")

# Source convention: front axle is at negative Y. Blender's glTF axis
# conversion maps that direction to +Z in Three.js, matching NeonJourney.
scale = 1.0 / length
root = bpy.data.objects.new("SUV_WEB_ROOT", None)
bpy.context.scene.collection.objects.link(root)
root.scale = (scale, scale, scale)
root.location = (
    -((low.x + high.x) * 0.5) * scale,
    -((low.y + high.y) * 0.5) * scale,
    -low.z * scale,
)
for obj in meshes:
    obj.parent = root

# Export only the licensed vehicle hierarchy. Images are deliberately absent.
bpy.ops.object.select_all(action="DESELECT")
root.select_set(True)
for obj in meshes:
    obj.select_set(True)

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
)

print(
    "SUV_WEB_EXPORT",
    f"output={OUTPUT}",
    f"meshes={len(meshes)}",
    f"polygons={sum(len(obj.data.polygons) for obj in meshes)}",
    f"source_length={length:.4f}",
)

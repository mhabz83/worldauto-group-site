"""FastTrack destination v2: open steel service pavilion, real kit parts only.
Structure = scaffold tubes (native wireframe citizens). Character = the kit's
service equipment at LOD1 (clean edges, no triangulated noise). No solid box."""
import bpy, sys, math
from pathlib import Path
from mathutils import Vector

args = sys.argv[sys.argv.index("--")+1:]
SRC, OUT = Path(args[0]), args[1]
PREVIEW = args[2] if len(args) > 2 else None

bpy.ops.object.select_all(action="SELECT"); bpy.ops.object.delete()

SOURCES = {}
def load(name, lod="LOD1"):
    """Import one kit FBX, keep only the wanted LOD object, park it as a source."""
    if name in SOURCES: return SOURCES[name]
    before = set(bpy.context.scene.objects)
    bpy.ops.import_scene.fbx(filepath=str(SRC / f"{name}.fbx"), use_anim=False)
    imported = [o for o in bpy.context.scene.objects if o not in before]
    meshes = [o for o in imported if o.type == "MESH"]
    want = [o for o in meshes if lod in o.name] or [o for o in meshes if "LOD0" in o.name] or meshes
    keep = want[0]
    for o in imported:
        if o is not keep: bpy.data.objects.remove(o, do_unlink=True)
    # bake the FBX import correction (scale/rotation) into the mesh so
    # placement transforms below start from identity
    bpy.ops.object.select_all(action="DESELECT")
    keep.select_set(True); bpy.context.view_layer.objects.active = keep
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    keep.name = f"SRC_{name}"
    keep.location = (0, 0, -1000)   # parked out of the export set
    SOURCES[name] = keep
    return keep

PLACED = []
def put(name, loc, rot_z_deg=0.0, scale=1.0, lod="LOD1"):
    src = load(name, lod)
    ob = src.copy(); ob.data = src.data
    bpy.context.collection.objects.link(ob)
    ob.scale = (scale, scale, scale)
    ob.rotation_euler = (0, 0, math.radians(rot_z_deg))
    ob.location = Vector(loc)
    PLACED.append(ob)
    return ob

TUBE_LEN = 2.0     # measured: Tube_1M long axis (local X)
TUBE_SLIM = 0.22   # true slim steel, not sewer pipe
def tube(a, b, slim=TUBE_SLIM):
    """A steel tube from point a to point b (kit Tube_1M stretched along X)."""
    a, b = Vector(a), Vector(b)
    d = b - a; L = d.length
    src = load("Tube_1M", "LOD0")           # 32 verts, cleanest circles
    ob = src.copy(); ob.data = src.data
    bpy.context.collection.objects.link(ob)
    ob.scale = (L / TUBE_LEN, slim, slim)
    ob.rotation_euler = d.to_track_quat('X', 'Z').to_euler()
    ob.location = (a + b) / 2
    PLACED.append(ob)
    return ob

# ---------------- pavilion: 3 bays x 6 = 18 wide, 6 deep, 4.2 tall ----------
W, D, H = 18.0, 6.0, 4.2
FRONT, BACK = 0.0, -D

# posts at every bay line, front + back
for x in (0, 6, 12, 18):
    for y in (FRONT, BACK):
        tube((x, y, 0), (x, y, H))
# top perimeter beams
tube((0, FRONT, H), (W, FRONT, H)); tube((0, BACK, H), (W, BACK, H))
tube((0, FRONT, H), (0, BACK, H)); tube((W, FRONT, H), (W, BACK, H))
# roof purlins at bay lines + mid-bay lamp rails
for x in (6, 12):
    tube((x, FRONT, H), (x, BACK, H))
# mid-height back rail (ties the long side together)
tube((0, BACK, H * 0.55), (W, BACK, H * 0.55))

# hanging strip lamps, one per bay (lamp local length = X, hangs ~1 down)
for cx in (3, 9, 15):
    put("Lamp_01", (cx, -D / 2, H - 0.02), 0, 1.0)

# ---------------- equipment ----------------
# Bay 1: two-post lift (the kit's hero piece)
put("Machine_01", (3.0, -3.2, 0), 0, 1.0)
# Bay 2: tire service — racks along the back, pile + changer up front
put("Tirerack_01", (7.4, -5.3, 0), 90, 1.0)   # long axis along the back wall
put("Tirerack_01", (10.6, -5.3, 0), 90, 1.0)
put("TirePile_01", (7.1, -1.6, 0), 25, 1.0)
put("Machine_03",  (10.6, -2.2, 0), -15, 1.0)
# Bay 3: second lift + bench wall
put("Machine_01", (15.0, -3.2, 0), 0, 1.0)
put("Drawer_02",  (17.4, -5.5, 0), 0, 1.0)
put("Machine_02", (13.0, -5.5, 0), 0, 1.0)
# service pipes on back posts
put("Pipe_02", (0.25, -5.8, 0), 0, 1.0)
put("Pipe_02", (17.75, -5.8, 0), 0, 1.0)
# electric house grounding the right end, outside the frame
put("Eletric_House_01", (20.4, -4.4, 0), 90, 0.9)

# floor plates: ground grid the road can read (2x2 plates, 4 verts each)
for ix in range(9):
    for iy in range(3):
        put("Floor_01", (1.0 + ix * 2.0, -1.0 - iy * 2.0, 0.002), 0, 1.0)

# ---------------- cleanup, center, export ----------------
for src in SOURCES.values():
    bpy.data.objects.remove(src, do_unlink=True)

# center X/Y on origin, ground at z=0
mn = Vector((1e9,) * 3); mx = Vector((-1e9,) * 3)
for o in PLACED:
    if not o.name or o.name not in bpy.context.scene.objects: continue
    for c in o.bound_box:
        w = o.matrix_world @ Vector(c)
        mn = Vector(map(min, mn, w)); mx = Vector(map(max, mx, w))
ctr = (mn + mx) / 2
off = Vector((-ctr.x, -ctr.y, -mn.z))
for o in PLACED: o.location = Vector(o.location) + off

verts = sum(len(o.data.vertices) for o in PLACED)
print(f"PAVILION: {len(PLACED)} parts, {verts} verts, dims=({(mx-mn).x:.1f},{(mx-mn).y:.1f},{(mx-mn).z:.1f})")

bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(filepath=OUT, use_selection=True, export_materials="NONE", export_yup=True)
print("EXPORTED", OUT)

if PREVIEW:
    cam_data = bpy.data.cameras.new("c"); cam = bpy.data.objects.new("c", cam_data)
    bpy.context.collection.objects.link(cam)
    size = (mx - mn).length
    cam.location = Vector((size * 0.55, -size * 0.72, size * 0.28))
    dvec = Vector((0, 0, 1.4)) - cam.location
    cam.rotation_euler = dvec.to_track_quat('-Z', 'Y').to_euler()
    bpy.context.scene.camera = cam
    sun = bpy.data.objects.new("s", bpy.data.lights.new("s", "SUN")); sun.rotation_euler = (0.9, 0.2, 0.6)
    bpy.context.collection.objects.link(sun)
    bpy.context.scene.render.engine = "BLENDER_WORKBENCH"
    bpy.context.scene.display.shading.light = "STUDIO"
    bpy.context.scene.display.shading.show_cavity = True
    bpy.context.scene.render.resolution_x = 1400; bpy.context.scene.render.resolution_y = 900
    bpy.context.scene.render.filepath = PREVIEW
    bpy.ops.render.render(write_still=True)
    print("PREVIEW", PREVIEW)
    # orthographic front-top debug view
    cam.data.type = "ORTHO"; cam.data.ortho_scale = 30
    cam.location = Vector((0, -30, 10)); 
    dv = Vector((0, 0, 2)) - cam.location
    cam.rotation_euler = dv.to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.render.filepath = PREVIEW.replace(".png", "-front.png")
    bpy.ops.render.render(write_still=True)
    print("PREVIEW2", PREVIEW.replace(".png", "-front.png"))

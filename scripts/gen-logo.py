"""Generates the Kui Anasy emblem as clean, symmetric SVG.

Geometry (viewBox 0 0 200 200):
- double ring;
- four pairs of rays rising behind the dombra and crossing below its body;
- the dombra: leaf-shaped head with two peg holes, fretted neck, drop-shaped body
  with a sound hole and a small qoshqar-muyiz ornament;
- two qoshqar-muyiz (ram's horn) scrolls on the sides.
Rays and scrolls are masked by the body silhouette so the emblem stays transparent.
"""
import sys

CX = 100

def mirror(path_pts):
    return [(2 * CX - x, y) for x, y in path_pts]

def fmt(n):
    return f"{n:.1f}".rstrip('0').rstrip('.')

def cubic_path(pts):
    # pts: start, then groups of 3 (c1, c2, end)
    s = f"M{fmt(pts[0][0])} {fmt(pts[0][1])}"
    for i in range(1, len(pts), 3):
        c1, c2, e = pts[i:i + 3]
        s += f" C{fmt(c1[0])} {fmt(c1[1])} {fmt(c2[0])} {fmt(c2[1])} {fmt(e[0])} {fmt(e[1])}"
    return s

# --- rays: elliptical arcs that bulge outward and cross under the body ---
# (offset from centre at the top, top y, end offset to the other side)
BOTTOM = 170
RAYS = [(18, 64, 4), (30, 54, 10), (42, 48, 16), (54, 52, 22)]

def ray_pair(d, top, e):
    # Quarter ellipse: vertical at the top, turning toward the centre at the bottom.
    rx = d + e
    ry = BOTTOM - top
    left = f"M{CX - d} {top} A{rx} {ry} 0 0 0 {CX + e} {BOTTOM}"
    right = f"M{CX + d} {top} A{rx} {ry} 0 0 1 {CX - e} {BOTTOM}"
    return [left, right]

ray_paths = []
for d, top, e in RAYS:
    ray_paths += ray_pair(d, top, e)

# --- dombra body (drop) ---
BODY = ("M100 114 C116 119 128 136 127 156 C126 172 115 183 100 186 "
        "C85 183 74 172 73 156 C72 136 84 119 100 114 Z")
BODY_OUTER = ("M100 110 C119 116 132 135 131 156 C130 174 117 186 100 189 "
              "C83 186 70 174 69 156 C68 135 81 116 100 110 Z")  # knock-out halo

HEAD = "M100 14 C107 21 108 33 102.6 43 L97.4 43 C92 33 93 21 100 14 Z"

# --- side scroll (qoshqar muyiz): flame-like tail rising outward, curl at the base ---
SCROLL_L = [
    (46, 112),
    (30, 128), (26, 156), (46, 168),
    (58, 175), (70, 164), (64, 155),
    (59, 148), (50, 151), (52, 158),
]

def svg(color="currentColor", title=True):
    rays = "\n    ".join(f'<path d="{p}"/>' for p in ray_paths)
    scroll_l = cubic_path(SCROLL_L)
    scroll_r = cubic_path(mirror(SCROLL_L))
    frets = "".join(f'<path d="M97.5 {y} H102.5"/>' for y in (56, 66, 76, 86, 96))
    t = '<title>Күй анасы қоры</title>' if title else ''
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="Күй анасы қоры" fill="none" stroke="{color}">
  {t}
  <defs>
    <mask id="ka-body-knockout" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
      <rect width="200" height="200" fill="#fff"/>
      <path d="{BODY_OUTER}" fill="#000"/>
      <rect x="94" y="40" width="12" height="76" fill="#000"/>
    </mask>
    <mask id="ka-head-holes" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
      <rect width="200" height="200" fill="#fff"/>
      <circle cx="100" cy="25" r="2.2" fill="#000"/>
      <circle cx="100" cy="33" r="2.2" fill="#000"/>
    </mask>
  </defs>
  <circle cx="100" cy="100" r="96" stroke-width="4.5"/>
  <circle cx="100" cy="100" r="89" stroke-width="1.4"/>
  <g mask="url(#ka-body-knockout)" stroke-width="5.2" stroke-linecap="butt">
    {rays}
  </g>
  <g stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="{scroll_l}"/>
    <path d="{scroll_r}"/>
  </g>
  <path d="{HEAD}" fill="{color}" stroke="none" mask="url(#ka-head-holes)"/>
  <path d="M98 43 V116 M102 43 V116" stroke-width="2.2"/>
  <g stroke-width="1.6">{frets}</g>
  <path d="{BODY}" stroke-width="4.4" stroke-linejoin="round"/>
  <circle cx="100" cy="137" r="7.5" stroke-width="2.6"/>
  <path d="M100 130 V144" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M100 160 V178 M100 166 C96 158 87 157 86 165 C85 171 92 172 93 167 M100 166 C104 158 113 157 114 165 C115 171 108 172 107 167" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
'''

def favicon():
    rays = "".join(f'<path d="{p}"/>' for i, p in enumerate(ray_paths) if i // 2 in (1, 3))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="32" height="32">
  <defs>
    <mask id="k" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
      <rect width="200" height="200" fill="#fff"/>
      <path d="{BODY_OUTER}" fill="#000"/>
      <rect x="92" y="40" width="16" height="76" fill="#000"/>
    </mask>
  </defs>
  <rect width="200" height="200" rx="44" fill="#10291F"/>
  <g fill="none" stroke="#D7B45F">
    <g mask="url(#k)" stroke-width="9">{rays}</g>
    <path d="{HEAD}" fill="#D7B45F" stroke="none"/>
    <path d="M100 42 V116" stroke-width="7"/>
    <path d="{BODY}" stroke-width="9" stroke-linejoin="round"/>
    <circle cx="100" cy="140" r="8" fill="#D7B45F" stroke="none"/>
  </g>
</svg>
'''

if __name__ == "__main__":
    out = sys.argv[1]
    open(out + "/kui-anasy-mark.svg", "w", encoding="utf-8").write(svg())
    open(out + "/kui-anasy-mark-gold.svg", "w", encoding="utf-8").write(svg("#D7B45F"))
    open(out + "/kui-anasy-mark-forest.svg", "w", encoding="utf-8").write(svg("#10291F"))
    open(out + "/../favicon.svg", "w", encoding="utf-8").write(favicon())
    print("ok")

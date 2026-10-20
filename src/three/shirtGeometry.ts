import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { SHIRT, sleeveProfile, torsoProfile } from './shirtProfile'

const AROUND = 56
const TORSO_ROWS = 44
const SLEEVE_ROWS = 14
const YOKE_ROWS = 8

type Mesh = { pos: number[]; idx: number[] }

/** Сшивает сетку из колец в полосу треугольников. Кольца замкнутые, поэтому
 *  последний столбец соединяется с первым. */
function addRings(mesh: Mesh, rings: Vector3[][]) {
  const base = mesh.pos.length / 3
  const cols = rings[0].length

  for (const ring of rings) for (const p of ring) mesh.pos.push(p.x, p.y, p.z)

  for (let r = 0; r < rings.length - 1; r++) {
    for (let c = 0; c < cols; c++) {
      const next = (c + 1) % cols
      const a = base + r * cols + c
      const b = base + r * cols + next
      const d = base + (r + 1) * cols + c
      const e = base + (r + 1) * cols + next
      mesh.idx.push(a, d, b, b, d, e)
    }
  }
}

/** Закрывает кольцо диском: без этого сквозь подол и срез рукава видно
 *  изнанку. */
function addCap(mesh: Mesh, ring: Vector3[], center: Vector3, flip: boolean) {
  const base = mesh.pos.length / 3
  for (const p of ring) mesh.pos.push(p.x, p.y, p.z)
  const hub = mesh.pos.length / 3
  mesh.pos.push(center.x, center.y, center.z)

  for (let c = 0; c < ring.length; c++) {
    const next = (c + 1) % ring.length
    if (flip) mesh.idx.push(hub, base + next, base + c)
    else mesh.idx.push(hub, base + c, base + next)
  }
}

/** Мягкие складки: ткань не бывает идеально гладкой, а на ровной трубе это
 *  сразу читается как пластик. */
function fold(x: number, y: number, z: number): number {
  return Math.sin(x * 4.1 + y * 1.3) * 0.012 + Math.cos(z * 5.3 - y * 1.9) * 0.01
}

function torsoRing(v: number): Vector3[] {
  const { rx, rz } = torsoProfile(v)
  const y = SHIRT.hemY + (SHIRT.shoulderY - SHIRT.hemY) * v
  const ring: Vector3[] = []

  for (let c = 0; c < AROUND; c++) {
    const a = (c / AROUND) * Math.PI * 2
    const x = Math.cos(a) * rx
    const z = Math.sin(a) * rz
    const push = 1 + fold(x, y, z)
    ring.push(new Vector3(x * push, y, z * push))
  }
  return ring
}

function sleeveRings(side: 1 | -1): Vector3[][] {
  const shoulder = torsoProfile(0.88)
  // Плечо спущенное: шов рукава сидит заметно ниже плечевой линии, как на
  // оверсайзе. Начало утоплено в корпус, чтобы стык не был виден.
  const start = new Vector3(side * shoulder.rx * 0.72, SHIRT.shoulderY - 0.34, 0)
  const axis = new Vector3(side, -SHIRT.sleeveDrop, 0).normalize()

  // Базис поперёк рукава: вдоль оси Z и перпендикулярно ей.
  const across = new Vector3(0, 0, 1)
  const up = new Vector3().crossVectors(axis, across).normalize()

  const rings: Vector3[][] = []
  for (let r = 0; r <= SLEEVE_ROWS; r++) {
    const u = r / SLEEVE_ROWS
    // Последняя четверть — подвёрнутый край: срез рукава заворачивается
    // внутрь, иначе он читается как открытая труба.
    const cuff = Math.max(0, (u - 0.78) / 0.22)
    const radius = sleeveProfile(u) * (1 - cuff * 0.26)
    const center = start
      .clone()
      .addScaledVector(axis, (u - cuff * cuff * 0.16) * SHIRT.sleeveLength)
    const ring: Vector3[] = []

    for (let c = 0; c < AROUND; c++) {
      const a = (c / AROUND) * Math.PI * 2
      const p = center
        .clone()
        .addScaledVector(across, Math.cos(a) * radius)
        .addScaledVector(up, Math.sin(a) * radius * 0.86)
      p.multiplyScalar(1 + fold(p.x, p.y, p.z))
      ring.push(p)
    }
    rings.push(ring)
  }
  return rings
}

/** Футболка целиком: корпус, плечевая кокетка, воротник и два рукава.
 *  Это настоящее тело вращения, а не выдавленный плоский силуэт, поэтому
 *  вещь читается с любой стороны. */
export function buildShirtGeometry(): BufferGeometry {
  const mesh: Mesh = { pos: [], idx: [] }

  // Корпус
  const torso: Vector3[][] = []
  for (let r = 0; r <= TORSO_ROWS; r++) torso.push(torsoRing(r / TORSO_ROWS))
  addRings(mesh, torso)
  addCap(mesh, torso[0], new Vector3(0, SHIRT.hemY - 0.04, 0), true)

  // Кокетка: от плеч внутрь к горловине
  const shoulder = torsoProfile(1)
  const yoke: Vector3[][] = []
  for (let r = 0; r <= YOKE_ROWS; r++) {
    const t = r / YOKE_ROWS
    const ease = t * t * (3 - 2 * t)
    const rx = shoulder.rx + (SHIRT.neckRx - shoulder.rx) * ease
    const rz = shoulder.rz + (SHIRT.neckRz - shoulder.rz) * ease
    const y = SHIRT.shoulderY - 0.02 + ease * 0.16
    const ring: Vector3[] = []

    for (let c = 0; c < AROUND; c++) {
      const a = (c / AROUND) * Math.PI * 2
      ring.push(new Vector3(Math.cos(a) * rx, y, Math.sin(a) * rz))
    }
    yoke.push(ring)
  }
  addRings(mesh, yoke)

  // Воротник: короткая стойка вокруг горловины
  const collar: Vector3[][] = []
  for (let r = 0; r <= 3; r++) {
    const t = r / 3
    const rx = SHIRT.neckRx + 0.035 * Math.sin(t * Math.PI)
    const rz = SHIRT.neckRz + 0.03 * Math.sin(t * Math.PI)
    const y = SHIRT.shoulderY + 0.14 + t * SHIRT.collarHeight
    const ring: Vector3[] = []

    for (let c = 0; c < AROUND; c++) {
      const a = (c / AROUND) * Math.PI * 2
      ring.push(new Vector3(Math.cos(a) * rx, y, Math.sin(a) * rz))
    }
    collar.push(ring)
  }
  addRings(mesh, collar)

  // Рукава
  for (const side of [1, -1] as const) {
    const rings = sleeveRings(side)
    addRings(mesh, rings)
    const last = rings[rings.length - 1]
    const centre = last
      .reduce((acc, p) => acc.add(p), new Vector3())
      .multiplyScalar(1 / last.length)
    addCap(mesh, last, centre, side === 1)
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(mesh.pos, 3))
  geometry.setIndex(mesh.idx)

  const smoothed = mergeVertices(geometry, 1e-4)
  smoothed.computeVertexNormals()
  smoothed.center()

  return smoothed
}

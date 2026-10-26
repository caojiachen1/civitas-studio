import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1)

function normalizeCollectorGeometry(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  let result = geo
  if (result.index) {
    result = result.toNonIndexed()
    geo.dispose()
  }
  if (!result.getAttribute('normal')) result.computeVertexNormals()
  if (!result.getAttribute('uv')) {
    result.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(result.getAttribute('position').count * 2), 2))
  }
  for (const name of Object.keys(result.attributes)) {
    if (!['position', 'normal', 'uv'].includes(name)) result.deleteAttribute(name)
  }
  result.morphAttributes = {}
  return result
}

export class GeometryCollector {
  private buckets = new Map<THREE.Material, THREE.BufferGeometry[]>()

  add(geometry: THREE.BufferGeometry, material: THREE.Material) {
    const normalized = normalizeCollectorGeometry(geometry)
    let bucket = this.buckets.get(material)
    if (!bucket) {
      bucket = []
      this.buckets.set(material, bucket)
    }
    bucket.push(normalized)
  }

  addBox(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    material: THREE.Material,
    rotY = 0,
    rotX = 0,
  ) {
    const geo = UNIT_BOX.clone()
    const matrix = new THREE.Matrix4()
    const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rotX, rotY, 0, 'YXZ'))
    matrix.compose(new THREE.Vector3(x, y, z), quat, new THREE.Vector3(w, h, d))
    geo.applyMatrix4(matrix)
    this.add(geo, material)
  }

  addBeam(a: THREE.Vector3, b: THREE.Vector3, width: number, height: number, material: THREE.Material) {
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)
    const xAxis = new THREE.Vector3().subVectors(b, a)
    const len = xAxis.length()
    if (len < 1e-5) return
    xAxis.normalize()
    const zAxis = new THREE.Vector3().crossVectors(xAxis, new THREE.Vector3(0, 1, 0))
    if (zAxis.lengthSq() < 1e-6) zAxis.set(0, 0, 1)
    zAxis.normalize()
    const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize()
    const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis)
    const quat = new THREE.Quaternion().setFromRotationMatrix(basis)
    const geo = UNIT_BOX.clone()
    const matrix = new THREE.Matrix4().compose(mid, quat, new THREE.Vector3(len, height, width))
    geo.applyMatrix4(matrix)
    this.add(geo, material)
  }

  build(options: { castShadow?: boolean; receiveShadow?: boolean; name?: string } = {}): THREE.Group {
    const group = new THREE.Group()
    if (options.name) group.name = options.name
    for (const [material, geos] of this.buckets) {
      if (geos.length === 0) continue
      const merged = geos.length === 1 ? geos[0] : mergeGeometries(geos, false)
      if (!merged) continue
      merged.computeBoundingSphere()
      const mesh = new THREE.Mesh(merged, material)
      const transparent = (material as THREE.MeshStandardMaterial).transparent
      mesh.castShadow = (options.castShadow ?? true) && !transparent
      mesh.receiveShadow = options.receiveShadow ?? true
      mesh.matrixAutoUpdate = false
      group.add(mesh)
      if (geos.length > 1) geos.forEach((g) => g.dispose())
    }
    return group
  }
}

export function solidRibbonGeometry(
  samples: { pos: THREE.Vector3; side: THREE.Vector3 }[],
  left: number,
  right: number,
  topOffset: number,
  thickness: number,
  caps = true,
): THREE.BufferGeometry {
  const positions: number[] = []
  const indices: number[] = []
  const uvs: number[] = []
  const n = samples.length
  if (n < 2) return new THREE.BufferGeometry()
  for (let i = 0; i < n; i++) {
    const s = samples[i]
    const lx = s.pos.x + s.side.x * left
    const lz = s.pos.z + s.side.z * left
    const rx = s.pos.x + s.side.x * right
    const rz = s.pos.z + s.side.z * right
    const yTop = s.pos.y + topOffset
    const yBot = yTop - thickness
    positions.push(lx, yTop, lz, rx, yTop, rz, lx, yBot, lz, rx, yBot, rz)
    const v = s.pos.x + s.pos.z
    uvs.push(0, v, 1, v, 0, v, 1, v)
    if (i < n - 1) {
      const base = i * 4
      const nb = (i + 1) * 4
      indices.push(base, nb, base + 1, nb, nb + 1, base + 1)
      indices.push(base + 2, base + 3, nb + 2, nb + 2, base + 3, nb + 3)
      indices.push(base, base + 2, nb, nb, base + 2, nb + 2)
      indices.push(base + 1, nb + 1, base + 3, nb + 1, nb + 3, base + 3)
    }
  }
  if (caps) {
    let base = 0
    indices.push(base, base + 1, base + 2, base + 2, base + 1, base + 3)
    base = (n - 1) * 4
    indices.push(base, base + 2, base + 1, base + 2, base + 3, base + 1)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

export function stripGeometry(
  samples: { pos: THREE.Vector3; side: THREE.Vector3 }[],
  left: number,
  right: number,
  yOffset: number,
): THREE.BufferGeometry {
  const positions: number[] = []
  const indices: number[] = []
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i]
    positions.push(
      s.pos.x + s.side.x * left,
      s.pos.y + yOffset,
      s.pos.z + s.side.z * left,
      s.pos.x + s.side.x * right,
      s.pos.y + yOffset,
      s.pos.z + s.side.z * right,
    )
    if (i < samples.length - 1) {
      const b = i * 2
      indices.push(b, b + 2, b + 1, b + 2, b + 3, b + 1)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(samples.length * 4), 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

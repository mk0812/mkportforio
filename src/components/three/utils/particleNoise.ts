/** Lightweight 3D value noise for CPU-side particle curl approximation */

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function hash3(x: number, y: number, z: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return n - Math.floor(n)
}

function valueNoise(x: number, y: number, z: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)
  const xf = x - xi
  const yf = y - yi
  const zf = z - zi

  const n000 = hash3(xi, yi, zi)
  const n100 = hash3(xi + 1, yi, zi)
  const n010 = hash3(xi, yi + 1, zi)
  const n110 = hash3(xi + 1, yi + 1, zi)
  const n001 = hash3(xi, yi, zi + 1)
  const n101 = hash3(xi + 1, yi, zi + 1)
  const n011 = hash3(xi, yi + 1, zi + 1)
  const n111 = hash3(xi + 1, yi + 1, zi + 1)

  const u = fade(xf)
  const v = fade(yf)
  const w = fade(zf)

  const x00 = lerp(n000, n100, u)
  const x10 = lerp(n010, n110, u)
  const x01 = lerp(n001, n101, u)
  const x11 = lerp(n011, n111, u)
  const y0 = lerp(x00, x10, v)
  const y1 = lerp(x01, x11, v)
  return lerp(y0, y1, w) * 2 - 1
}

export function curlNoise(x: number, y: number, z: number, t: number): [number, number, number] {
  const eps = 0.08
  const px = valueNoise(x, y + eps, z + t)
  const nx = valueNoise(x, y - eps, z + t)
  const py = valueNoise(x, y, z + eps + t)
  const ny = valueNoise(x, y, z - eps + t)
  const pz = valueNoise(x + eps, y, z + t)
  const nz = valueNoise(x - eps, y, z + t)

  const cx = py - ny - (px - nx)
  const cy = pz - nz - (py - ny)
  const cz = px - nx - (pz - nz)
  return [cx, cy, cz]
}

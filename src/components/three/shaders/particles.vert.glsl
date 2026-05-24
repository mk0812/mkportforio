attribute vec3 position;

uniform float uTime;
uniform vec3 uMouse;
uniform float uCurlStrength;
uniform float uMagnetRadius;
uniform float uMagnetStrength;
uniform float uPointSize;
uniform float uReducedMotion;

varying float vAlpha;

float hash3(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

float fade(float t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float valueNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);

  float n000 = hash3(i);
  float n100 = hash3(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash3(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash3(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash3(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash3(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash3(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash3(i + vec3(1.0, 1.0, 1.0));

  float u = fade(f.x);
  float v = fade(f.y);
  float w = fade(f.z);

  float x00 = mix(n000, n100, u);
  float x10 = mix(n010, n110, u);
  float x01 = mix(n001, n101, u);
  float x11 = mix(n011, n111, u);
  float y0 = mix(x00, x10, v);
  float y1 = mix(x01, x11, v);
  return mix(y0, y1, w) * 2.0 - 1.0;
}

vec3 curlNoise(vec3 p, float t) {
  float eps = 0.08;
  float px = valueNoise(vec3(p.x, p.y + eps, p.z + t));
  float nx = valueNoise(vec3(p.x, p.y - eps, p.z + t));
  float py = valueNoise(vec3(p.x, p.y, p.z + eps + t));
  float ny = valueNoise(vec3(p.x, p.y, p.z - eps + t));
  float pz = valueNoise(vec3(p.x + eps, p.y, p.z + t));
  float nz = valueNoise(vec3(p.x - eps, p.y, p.z + t));

  float cx = py - ny - (px - nx);
  float cy = pz - nz - (py - ny);
  float cz = px - nx - (pz - nz);
  return vec3(cx, cy, cz);
}

void main() {
  vec3 pos = position;

  if (uReducedMotion < 0.5) {
    vec3 curl = curlNoise(position * 0.35, uTime * 0.18);
    pos += curl * uCurlStrength;

    vec2 delta = uMouse.xy - pos.xy;
    float dist = length(delta);
    if (dist < uMagnetRadius && dist > 0.001) {
      float pull = (1.0 - dist / uMagnetRadius) * uMagnetStrength;
      pos.xy += (delta / dist) * pull;
    }
  }

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float distToCamera = max(-mvPosition.z, 0.5);
  gl_PointSize = uPointSize * (3.0 / distToCamera);

  vAlpha = 0.7;
}

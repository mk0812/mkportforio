uniform float uTime;
uniform float uTimeOffset;
uniform float uPhaseShift;
uniform vec2 uMouse;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vDisp;
varying vec3 vPos;

#include noise

float displacement(vec3 p, float t) {
  vec3 q = p * 1.25 + vec3(t + uPhaseShift, t * 0.7, uMouse.x * 0.6 + uMouse.y * 0.4);
  return fbm(q) * 0.45;
}

void main() {
  float t = (uTime + uTimeOffset) * 0.22;
  vec3 pos = position;
  float disp = displacement(pos, t);
  vDisp = disp;

  const float eps = 0.015;
  vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.0)));
  if (length(tangent) < 0.001) {
    tangent = normalize(cross(normal, vec3(1.0, 0.0, 0.0)));
  }
  vec3 bitangent = normalize(cross(normal, tangent));

  float dx = displacement(pos + tangent * eps, t) - disp;
  float dy = displacement(pos + bitangent * eps, t) - disp;
  vec3 displacedNormal = normalize(normal - (dx / eps) * tangent - (dy / eps) * bitangent);

  pos += normal * disp;

  vNormal = normalize(normalMatrix * displacedNormal);
  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  vViewDir = normalize(-mvPos.xyz);
  vPos = pos;
  gl_Position = projectionMatrix * mvPos;
}

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uTime;
uniform float uTimeOffset;
uniform float uPhaseShift;
uniform float uOpacity;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vDisp;
varying vec3 vPos;

#include noise

void main() {
  float t = (uTime + uTimeOffset) * 0.22;
  float ripple = fbm(vPos * 1.8 + vec3(t * 0.35 + uPhaseShift, t * 0.25, 0.0));
  float tMix = vDisp * 0.5 + 0.5 + ripple * 0.18;

  vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.6, tMix));
  col = mix(col, uColorC, smoothstep(0.5, 1.0, tMix));

  float fres = pow(1.0 - clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0), 2.2);
  vec3 fresCol = mix(uColorA, uColorB, smoothstep(0.0, 0.55, fres));
  fresCol = mix(fresCol, uColorC, smoothstep(0.45, 1.0, fres));
  col = mix(col, fresCol, fres * 0.72);
  col += fres * 0.18;

  float causticA = abs(sin(vPos.x * 14.0 + vPos.y * 11.0 + t * 1.4));
  float causticB = abs(sin(vPos.z * 12.0 - vPos.x * 9.0 + t * 0.9));
  float caustic = smoothstep(0.92, 0.995, causticA * causticB);
  float darkMask = 1.0 - smoothstep(0.35, 0.95, tMix + ripple * 0.2);
  col += caustic * darkMask * 0.06;

  float shimmer = 0.5 + 0.5 * sin(uTime * 0.5 + vPos.x * 1.5 + vPos.y * 2.0);
  col += shimmer * 0.04;

  gl_FragColor = vec4(col, uOpacity);
}

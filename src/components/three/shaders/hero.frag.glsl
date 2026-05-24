uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uTime;
varying vec3 vNormal;
varying float vDisp;
varying vec3 vPos;

void main() {
  float t = vDisp * 0.5 + 0.5;
  vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.6, t));
  col = mix(col, uColorC, smoothstep(0.5, 1.0, t));

  // Rim / fresnel glow toward edges
  float fres = pow(1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.4);
  col += fres * 0.85;

  // Subtle hue shimmer over time
  float shimmer = 0.5 + 0.5 * sin(uTime * 0.5 + vPos.x * 1.5 + vPos.y * 2.0);
  col += shimmer * 0.05;

  gl_FragColor = vec4(col, 1.0);
}

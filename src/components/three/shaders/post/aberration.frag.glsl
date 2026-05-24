uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uAberrationStrength;
uniform float uGrainStrength;
uniform float uVignetteStrength;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 centered = vUv - 0.5;
  float dist = length(centered);
  vec2 dir = dist > 0.0001 ? centered / dist : vec2(0.0);

  float aber = uAberrationStrength * dist * dist;
  vec2 offset = dir * aber;

  vec3 col;
  col.r = texture2D(tDiffuse, vUv + offset).r;
  col.g = texture2D(tDiffuse, vUv).g;
  col.b = texture2D(tDiffuse, vUv - offset).b;

  float grain = hash(vUv * 512.0 + uTime * 47.0) - 0.5;
  col += grain * uGrainStrength;

  float vignette = 1.0 - uVignetteStrength * smoothstep(0.35, 0.92, dist * 1.35);
  col *= vignette;

  gl_FragColor = vec4(col, 1.0);
}

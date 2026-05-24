varying float vAlpha;

void main() {
  vec2 centered = gl_PointCoord - 0.5;
  float dist = length(centered);
  if (dist > 0.5) discard;

  float alpha = vAlpha * (1.0 - smoothstep(0.3, 0.5, dist));
  gl_FragColor = vec4(0.604, 0.639, 1.0, alpha);
}

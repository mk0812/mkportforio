import aberrationFragmentShader from '../shaders/post/aberration.frag.glsl?raw'

const postVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export interface PostShaderUniforms {
  tDiffuse: { value: null }
  uTime: { value: number }
  uAberrationStrength: { value: number }
  uGrainStrength: { value: number }
  uVignetteStrength: { value: number }
}

export function createPostShaderUniforms(): PostShaderUniforms {
  return {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAberrationStrength: { value: 0.0045 },
    uGrainStrength: { value: 0.035 },
    uVignetteStrength: { value: 0.08 },
  }
}

export const postShader = {
  uniforms: createPostShaderUniforms(),
  vertexShader: postVertexShader,
  fragmentShader: aberrationFragmentShader,
}

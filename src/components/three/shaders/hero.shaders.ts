import noiseGlsl from './noise.glsl?raw'
import vertexBody from './hero.vert.glsl?raw'
import fragmentBody from './hero.frag.glsl?raw'

function injectNoise(source: string): string {
  return source.replace('#include noise', noiseGlsl)
}

const vertexShader = injectNoise(vertexBody)
const fragmentShader = injectNoise(fragmentBody)

export { vertexShader, fragmentShader }

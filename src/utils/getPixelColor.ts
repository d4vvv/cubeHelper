import { CUBE_COLORS } from './CubeColors'

export const getPixelColor = (pixelData: Uint8ClampedArray): number => {
  const [r, g, b] = pixelData

  if (r === 255 && g === 255 && b === 255) {
    return CUBE_COLORS.WHITE
  } else if (r === 255 && g === 0 && b === 0) {
    return CUBE_COLORS.RED
  } else if (r === 0 && g === 0 && b === 255) {
    return CUBE_COLORS.BLUE
  } else if (r === 0 && g === 255 && b === 0) {
    return CUBE_COLORS.GREEN
  } else if (r === 255 && g === 255 && b === 0) {
    return CUBE_COLORS.YELLOW
  } else {
    return CUBE_COLORS.ORANGE
  }
}

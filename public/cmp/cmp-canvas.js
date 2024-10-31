function createCanvas(id) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.id = id
  return {
    canvas: canvas,
    ctx: ctx
  }
}
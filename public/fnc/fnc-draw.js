function drawLineInfo(ctx, info, x, y, isOnBound=false, isOnCircle=false) {
  if (isOnBound) drawBound(ctx, info, x + info.x, y + info.y)
  for (const dw of info.list) {
    drawPointList(ctx, dw, x + info.x, y + info.y)
    if (isOnCircle) drawPointsCircle(ctx, dw, x + info.x, y + info.y)
  }
  // if (isOnBound) drawBound(ctx, info, x + info.x, y + info.y)
  for (const c of info.child) drawLineInfo(ctx, c, x + info.x, y + info.y, isOnBound, isOnCircle)
}

function drawPointList(ctx, info, sx=0, sy=0) {
  let startX = 0 + sx
  let startY = 0 + sy
  let type = (info.width > 0) ? 'stroke' : 'fill'
  ctx.fillStyle = info.color
  ctx.strokeStyle = info.color
  let lineW = info.width
  // if (lineW < 1) lineW = 2 // shape fill has margin between shape
  ctx.lineWidth = lineW
  ctx.beginPath()
  let isFirst = true
  for (const p of info.list) {
    const x = p.x + startX
    const y = p.y + startY
    if (isFirst) {
      ctx.moveTo(x, y)
      isFirst = false
    } else {
      ctx.lineTo(x, y)
    }
  }
  if (type === 'fill') {
    // ctx.closePath()
    // ctx.stroke()
    ctx.fill()
  } else {
    // ctx.closePath()
    ctx.stroke()
  }
}

function drawBound(ctx, info, sx=0, sy=0, color='red') {
  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.strokeStyle = color
  ctx.strokeRect(sx, sy, info.w, info.h)
  ctx.stroke()
}

function drawPointsCircle(ctx, info, sx=0, sy=0) {
  let startX = 0 + sx
  let startY = 0 + sy
  for (const p of info.list) {
    const x = p.x + startX
    const y = p.y + startY
    drawCircle(ctx, x, y)
  }
}

function drawCircle(ctx, x, y, r=4, color='black') {
  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.strokeStyle = color
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.stroke()
}

function drawPointsIndexCircle(ctx, info, sx=0, sy=0) {
  for (const dw of info.list) {
    let startX = 0 + sx
    let startY = 0 + sy
    let i = 0
    for (const p of dw.list) {
      const x = p.x + startX
      const y = p.y + startY
      drawCircle(ctx, x, y, 10)
      ctx.font = '16px serif'
      let m = -4
      if (i > 9) m = -8
      ctx.strokeText(`${i}`, x+m, y+4)
      i++
    }
  }
}

function drawIndexCircle(ctx, i, sx=0, sy=0, color='black') {
  const x = sx
  const y = sy
  drawCircle(ctx, x, y, 8, color)
  ctx.font = '12px serif'
  let m = -3.5
  if (i > 9) m = -7
  ctx.strokeText(`${i}`, x+m, y+4)
}

function drawArea(ctx, w, h, sx, sy, color='black') {
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(sx, sy)
  ctx.lineTo(sx + w, sy)
  ctx.lineTo(sx + w, sy + h)
  ctx.lineTo(sx, sy + h)
  ctx.lineTo(sx, sy)
  ctx.stroke()
}

function drawPart(ctx, partInfo, x, y, isOnBound=false, isOnCircle=false) {
  const sx = partInfo.x + x
  const sy = partInfo.y + y
  if (partInfo.drwLineInfo) {
    drawLineInfo(ctx, partInfo.lineInfo, sx, sy, isOnBound, isOnCircle)
  }
  const child = partInfo.child
  for (const c of child) {
    drawPart(ctx, c, sx, sy, isOnBound, isOnCircle)
  }
}
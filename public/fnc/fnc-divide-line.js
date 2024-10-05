// p: {x:0, y:0}
function divideLine(p0, p1, dv) {
  const dx = (p1.x - p0.x) / dv
  const dy = (p1.y - p0.y) / dv
  let x = p0.x
  let y = p0.y
  const list = []
  for (let i=0; i<=dv; i++) {
    list.push({ x: x, y: y })
    x += dx
    y += dy
  }
  return list
}

// p: {x:0, y:0}
function createPListCurve(p0, p1, cp, interval) {
  const sx = p0.x
  const sy = p0.y
  const ex = p1.x
  const ey = p1.y
  const cpx = cp.x
  const cpy = cp.y
  const dx = ex - sx
  const dy = ey - sy
  const distance = calcDistance(dx, dy)
  let t = 0
  const list = []
  while (t <= distance) {
    const s = t / distance
    const x = (1 - s) * (1 - s) * sx + 2 * s * (1 - s) * cpx + s * s * ex
    const y = (1 - s) * (1 - s) * sy + 2 * s * (1 - s) * cpy + s * s * ey
    list.push({
      x: x, y: y
    })
    if (t === distance) break

    t += interval
    if (t > distance) {
      t = distance
    }
  }

  return list
}

function createPListCubicBezier(p0, p1, cp0, cp1, interval) {
  const sx = p0.x
  const sy = p0.y
  const ex = p1.x
  const ey = p1.y
  const cpx0 = cp0.x
  const cpy0 = cp0.y
  const cpx1 = cp1.x
  const cpy1 = cp1.y
  const dx = ex - sx
  const dy = ey - sy
  const distance = calcDistance(dx, dy)
  let t = 0
  const list = []
  while (t <= distance) {
    const s = t/ distance
    const rs = 1 - s
    const x = rs * rs * rs * sx + 3 * rs * rs * s * cpx0 + 3 * rs * s * s * cpx1 + s * s * s * ex
    const y = rs * rs * rs * sy + 3 * rs * rs * s * cpy0 + 3 * rs * s * s * cpy1 + s * s * s * ey
    list.push({ x: x, y: y })
    if (t === distance) break
    t += interval
    if (t > distance) {
      t = distance
    }
  }
  return list
}

function createPListCubicBezierN4(p0, p1, cp0, cp1, cp2, interval) {
  const sx = p0.x
  const sy = p0.y
  const ex = p1.x
  const ey = p1.y
  const cpx0 = cp0.x
  const cpy0 = cp0.y
  const cpx1 = cp1.x
  const cpy1 = cp1.y
  const cpx2 = cp2.x
  const cpy2 = cp2.y
  const dx = ex - sx
  const dy = ey - sy
  const distance = calcDistance(dx, dy)
  let t = 0
  const list = []
  while (t <= distance) {
    const s = t/ distance
    const rs = 1 - s
    let x = rs * rs * rs * rs * sx + 4 * rs * rs * rs * s * cpx0 + 4 * rs * rs * s * s * cpx1
      + 4 * rs * s * s * s * cpx2  + s * s * s * s * ex
    let y = rs * rs * rs * rs * sy + 4 * rs * rs * rs * s * cpy0 + 4 * rs * rs * s * s * cpy1
      + 4 * rs * s * s * s * cpy2  + s * s * s * s * ey
    list.push({ x: x, y: y })
    if (t === distance) break
    t += interval
    if (t > distance) {
      t = distance
    }
  }
  return list
}

function createPListCubicBezierN5(p0, p1, cp0, cp1, cp2, cp3, interval) {
  const sx = p0.x
  const sy = p0.y
  const ex = p1.x
  const ey = p1.y
  const cpx0 = cp0.x
  const cpy0 = cp0.y
  const cpx1 = cp1.x
  const cpy1 = cp1.y
  const cpx2 = cp2.x
  const cpy2 = cp2.y
  const cpx3 = cp3.x
  const cpy3 = cp3.y
  const dx = ex - sx
  const dy = ey - sy
  const distance = calcDistance(dx, dy)
  let t = 0
  const list = []
  while (t <= distance) {
    const s = t / distance
    const rs = 1 - s
    let x = rs * rs * rs * rs * rs * sx
      + 5 * rs * rs * rs * rs * s * cpx0
      + 10 * rs * rs * rs * s * s * cpx1
      + 10 * rs * rs * s * s * s * cpx2
      + 5 * rs * s * s * s * s * cpx3
      + s * s * s * s * s * ex
    let y = rs * rs * rs * rs * rs * sy
      + 5 * rs * rs * rs * rs * s * cpy0
      + 10 * rs * rs * rs * s * s * cpy1
      + 10 * rs * rs * s * s * s * cpy2
      + 5 * rs * s * s * s * s * cpy3
      + s * s * s * s * s * ey
    list.push({ x: x, y: y })
    if (t === distance) break
    t += interval
    if (t > distance) {
      t = distance
    }
  }
  return list
}

function createCubicInfoBezierOvalQuarter(centerX, centerY, sizeX, sizeY, interval) {
  let sx = centerX - sizeX
  let sy = centerY - 0
  let px0 = centerX - sizeX
  let py0 = centerY - (0.552 * sizeY)
  let px1 = centerX - (0.552 * sizeX)
  let py1 = centerY - sizeY
  let ex = centerX - 0
  let ey = centerY - sizeY
  const cubicInfo = {
    p0: { x: sx, y: sy},
    p1: { x: ex, y: ey },
    cp0: { x: px0, y: py0 },
    cp1: { x: px1, y: py1 },
    interval: interval
  }
  return cubicInfo
}

function createPListCircle(centerX, centerY, sizeX, sizeY, interval) {
  const q0 = createCubicInfoBezierOvalQuarter(centerX, centerY, sizeX, sizeY, interval)
  const q1 = createCubicInfoBezierOvalQuarter(centerX, centerY, -sizeX, sizeY, interval)
  const q2 = createCubicInfoBezierOvalQuarter(centerX, centerY, -sizeX, -sizeY, interval)
  const q3 = createCubicInfoBezierOvalQuarter(centerX, centerY, sizeX, -sizeY, interval)
  const list0 = createPListCubicBezier(q0.p0, q0.p1, q0.cp0, q0.cp1, q0.interval)
  const list1 = createPListCubicBezier(q1.p0, q1.p1, q1.cp0, q1.cp1, q1.interval)
  const list2 = createPListCubicBezier(q2.p0, q2.p1, q2.cp0, q2.cp1, q2.interval)
  const list3 = createPListCubicBezier(q3.p0, q3.p1, q3.cp0, q3.cp1, q3.interval)
  return list0.concat(list1.reverse(), list2, list3.reverse())
}

function calcDistance(dx, dy) {
  return Math.sqrt(Math.abs(dx * dx) + Math.abs(dy * dy))
}
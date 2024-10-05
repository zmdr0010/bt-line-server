// info: line info
function createScaledLineInfo(info, scw, sch) {
  const uCode = `${info.uCode}-scale-${scw}x${sch}`
  const w = info.w * scw
  const h = info.h * sch
  const x = info.x * scw
  const y = info.y * sch
  const list = []
  for (const dw of info.list) {
    const width = dw.width
    const color = dw.color
    const pList = []
    for (const p of dw.list) {
      const scx = p.x / info.w
      const scy = p.y / info.h
      const x = w * scx
      const y = h * scy
      pList.push({ x: x, y: y })
    }
    list.push({ width: width, color: color, list: pList })
  }
  const child = []
  for (const c of info.child) child.push(createScaledLineInfo(c, scw, sch))
  return {
    uCode: uCode,
    w: w,
    h: h,
    x: x,
    y: y,
    list: list,
    child: child
  }
}

// rotateI
//     4 5
//   3     6
//   2     7
//     1 0
function createShiftRotateILineInfo(info, rotateI) {
  const uCode = `${info.uCode}-shift-rotate-i-${rotateI}`
  const w = info.w
  const h = info.h
  let rW = w
  let rH = h

  if (rotateI === 2 || rotateI === 3 || rotateI === 6 || rotateI === 7) {
    rW = h
    rH = w
  }
  const calcP = calcPosByRotateI(info.x, info.y, w, h, rotateI)

  const list = []

  for (const dw of info.list) {
    const pList = []
    for (const p of dw.list) {
      const cP = calcPosByRotateI(p.x, p.y, w, h, rotateI)
      pList.push({x: cP.x, y: cP.y})
    }
    list.push({
      width: dw.width,
      color: dw.color,
      list: pList
    })
  }
  const child = []
  for (const c of info.child) child.push(createShiftRotateILineInfo(c, rotateI))

  return {
    uCode: uCode,
    w: rW,
    h: rH,
    x: calcP.x,
    y: calcP.y,
    list: list,
    child: child
  }
}

function calcPosByRotateI(x, y, w, h, rotateI) {
  let rX = x
  let rY = y

  if (rotateI === 1) {
    rX = w - x
    rY = y
  }
  if (rotateI === 2) {
    rX = h - y
    rY = x
  }
  if (rotateI === 3) {
    rX = h - y
    rY = w - x
  }
  if (rotateI === 4) {
    rX = w - x
    rY = h - y
  }
  if (rotateI === 5) {
    rX = x
    rY = h - y
  }
  if (rotateI === 6) {
    rX = y
    rY = w - x
  }
  if (rotateI === 7) {
    rX = y
    rY = x
  }
  return { x: rX, y: rY }
}

// info: lineInfo
function createRotateLineInfo(info, radian) {
  const uCode = `${info.uCode}-radian-${radian}`
  const list = []
  const rtt = rotate(radian, info.x, info.y, 0, 0, 0, 0)

  for (const dw of info.list) {
    const pList = []
    for (const p of dw.list) {
      const rt = rotate(radian, p.x, p.y, 0, 0, 0, 0)
      pList.push({
        x: rt.x, y: rt.y
      })
    }
    list.push({
      width: dw.width,
      color: dw.color,
      list: pList
    })
  }

  const child = []
  for (const c of info.child) child.push(createRotateLineInfo(c, radian))

  const lineInfo = {
    uCode: uCode,
    w: info.w,
    h: info.h,
    x: rtt.x,
    y: rtt.y,
    list: list,
    child: child
  }

  return lineInfo
}

// [    ]     [               ]   [     ]
// | rx |  =  |  cos() -sin() |   |  x  |
// | ry |     |  sin()  cos() |   |  y  |
// [    ]     [               ]   [     ]
//
// rx = x cos() - y sin()
// ry = x sin() + y cos()
//
// rotate [x, 0] (ex. movieClip, canvas, rect ... rotation)
// rx = x cos() - 0 sin() = x cos()
// ry = x sin() + 0 cos() = x sin()
function rotate(radian, x, y, cx, cy, sx, sy) {
  const dx = x - cx
  const dy = y - cy
  const dis = calculateDistance(cx, cy, x, y)
  let ra = Math.atan2(dy, dx)
  ra += radian
  const mx = cx + dis * Math.cos(ra) + sx
  const my = cy + dis * Math.sin(ra) + sy
  return {x: mx, y: my}
}

function calculateDistance(x0, y0, x1, y1) {
  const x = x1 - x0
  const y = y1 - y0
  return Math.sqrt(x * x + y * y)
}

function degreeToRadian(degree) {
  return degree * Math.PI / 180
}

function radianToDegree(radian) {
  return radian * 180 / Math.PI
}

// pList: [{x: 0, y: 0}]
// pInfo: {
//    lt: {scx: 0, scy: 0}, rt: {scx: 1, scy: 0},
//    lb: {scx: 0, scy: 1}, rb: {scx: 1, scy: 1}
//  }
function transformPoints4(pList, w, h, pInfo) {
  const x0 = pInfo.lt.scx * w
  const y0 = pInfo.lt.scy * h
  const x1 = pInfo.rt.scx * w
  const y1 = pInfo.rt.scy * h
  const x2 = pInfo.rb.scx * w
  const y2 = pInfo.rb.scy * h
  const x3 = pInfo.lb.scx * w
  const y3 = pInfo.lb.scy * h

  const dx1 = x1 - x2
  const dx2 = x3 - x2
  const dx3 = x0 - x1 + x2 - x3
  const dy1 = y1 - y2
  const dy2 = y3 - y2
  const dy3 = y0 - y1 + y2 - y3

  const a13 = (dx3 * dy2 - dy3 * dx2) / (dx1 * dy2 - dy1 * dx2)
  const a23 = (dx1 * dy3 - dy1 * dx3) / (dx1 * dy2 - dy1 * dx2)
  const a11 = x1 - x0 + a13 * x1
  const a21 = x3 - x0 + a23 * x3
  const a31 = x0
  const a12 = y1 - y0 + a13 * y1
  const a22 = y3 - y0 + a23 * y3
  const a32 = y0

  const m = [
    a11, a12, a13,
    a21, a22, a23,
    a31, a32, 1
  ]

  const rpList = []
  for (const p of pList) {
    const scx = p.x / w
    const scy = p.y / h
    const rm = multiplyMatrixAndPoint3(m, [scx, scy, 1])

    const x = rm[0] / rm[2]
    const y = rm[1] / rm[2]

    rpList.push({ x: x, y: y})
  }
  return rpList
}

function multiplyMatrixAndPoint3(m, p) {
  const c0r0 = m[0]
  const c1r0 = m[1]
  const c2r0 = m[2]
  const c0r1 = m[3]
  const c1r1 = m[4]
  const c2r1 = m[5]
  const c0r2 = m[6]
  const c1r2 = m[7]
  const c2r2 = m[8]
  const x = p[0]
  const y = p[1]
  const z = p[2]
  const rx = x * c0r0 + y * c0r1 + z * c0r2
  const ry = x * c1r0 + y * c1r1 + z * c1r2
  const rz = x * c2r0 + y * c2r1 + z * c2r2
  return [rx, ry, rz]
}
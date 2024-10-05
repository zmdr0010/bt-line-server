// rotate x axis (roll)
// [ 1   0      0   ]   [ x ]
// | 0 cos() -sin() |   | y |
// [ 0 sin()  cos() ]   [ z ]
//
// rotate y axis (pitch)
// [ cos()   0  sin() ]  [ x ]
// |    0    1    0   |  | y |
// [ -sin()  0  cos() ]  [ z ]
//
// rotate z axis (yaw)
// [ cos() -sin()  0 ]  [ x ]
// | sin()  cos()  0 |  | y |
// [    0     0    1 ]  [ z ]

function rotateRoll(radian, x, y, z) {
  const ab = rotateAb(radian, z, y)
  return {x: x, y: ab.b, z: ab.a}
}

function rotatePitch(radian, x, y, z) {
  const ab = rotateAb(radian, x, z)
  return {x: ab.a, y: y, z: ab.b}
}

function rotateYaw(radian, x, y, z) {
  const ab = rotateAb(radian, y, x)
  return {x: ab.a, y: ab.b, z: z}
}

function rotateAb(radian, a, b, ca=0, cb=0, sa=0, sb=0) {
  const da = a - ca
  const db = b - cb
  const dis = calculateDistance(ca, cb, a, b)
  let ra = Math.atan2(da, db)
  ra += radian
  const ma = ca + dis * Math.cos(ra) + sa
  const mb = cb + dis * Math.sin(ra) + sb
  return {a: ma, b: mb}
}

// info: spLineInfo
// axis: x / y / z
function rotateInfoXYZ(info, radian, axis) {
  const uCode = `${info.uCode}-${axis}-radian-${radian}`
  const list = []
  let minX = 1000000000
  let minY = 1000000000
  for (const dw of info.list) {
    const pList = []
    for (const p of dw.list) {
      const x = p.x
      const y = p.y
      const z = p.z
      let rt
      if (axis === 'x') rt = rotateRoll(radian, x, y, z)
      if (axis === 'y') rt = rotatePitch(radian, x, y, z)
      if (axis === 'z') rt = rotateYaw(radian, x, y, z)
      console.log(rt)
      if (rt) {
        pList.push({
          x: rt.x, y: rt.y, z: rt.z
        })
        minX = Math.min(minX, rt.x)
        minY = Math.min(minY, rt.y)
      }
    }

    list.push({
      width: dw.width,
      color: dw.color,
      list: pList
    })
  }

  console.log(`minX: ${minX}, minY: ${minY}`)
  const mx = 0 - minX
  const my = 0 - minY
  if (mx !== 0 || my !== 0) {
    for (const dw of list) {
      for (const p of dw.list) {
        p.x += mx
        p.y += my
      }
    }
  }

  return {
    uCode: uCode,
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    list: list,
    child: []
  }
}
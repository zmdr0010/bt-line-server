// p has two line
// p0 ---- p1 line
// remove p0 go line, p1 from line
function makeLinePList(p, list, szw, szh) {
  list.push({ x: p.c * szw, y: p.r * szh })
  if (p.top) {
    p.top.bottom = null
    const top = p.top
    p.top = null
    makeLinePList(top, list, szw, szh)
    return
  }
  if (p.right) {
    const right = p.right
    p.right.left = null
    p.right = null
    makeLinePList(right, list, szw, szh)
    return
  }
  if (p.bottom) {
    const bottom = p.bottom
    p.bottom.top = null
    p.bottom = null
    makeLinePList(bottom, list, szw, szh)
    return
  }
  if (p.left) {
    const left = p.left
    p.left.right = null
    p.left = null
    makeLinePList(left, list, szw, szh)
    return
  }
}

// info: rawInfo { column: 2, row: 2, raw: [1,1,1,1] }
function calculatePList(info) {
  const pList = []
  const rectList = []
  const column = info.column
  const row = info.row

  for (let r=0; r<row; r++) {
    for (let c=0; c<column; c++) {
      makeP(c, r, info, pList, rectList)
    }
  }

  for (const p of pList) {
    checkRectOnP(p, rectList)
  }

  for (const p of pList) {
    checkPLine(p, pList)
  }

  return pList
}
// -----------------
// | rect0 | rect1 |
// -------(p)-------
// | rect3 | rect2 |
// -----------------
// check rect -> remove p top, right, bottom, left line
// for rectList -> result -> outline
function checkRectOnP(p, rectList) {
  const crtC0 = p.c - 1
  const crtR0 = p.r - 1
  const crtC1 = p.c
  const crtR1 = p.r - 1
  const crtC2 = p.c
  const crtR2 = p.r
  const crtC3 = p.c - 1
  const crtR3 = p.r
  const crtI0 = `${crtC0}-${crtR0}`
  const crtI1 = `${crtC1}-${crtR1}`
  const crtI2 = `${crtC2}-${crtR2}`
  const crtI3 = `${crtC3}-${crtR3}`
  const crt0 = rectList.find(obj => obj.id === crtI0)
  const crt1 = rectList.find(obj => obj.id === crtI1)
  const crt2 = rectList.find(obj => obj.id === crtI2)
  const crt3 = rectList.find(obj => obj.id === crtI3)
  // rect num 1
  if (!crt0 && !crt1 && !crt3 && crt2) {
    p.top = null
    p.left = null
  }
  if (!crt0 && !crt1 && crt3 && !crt2) {
    p.top = null
    p.right = null
  }
  if (crt0 && !crt1 && !crt3 && !crt2) {
    p.right = null
    p.bottom = null
  }
  if (!crt0 && crt1 && !crt3 && !crt2) {
    p.left = null
    p.bottom = null
  }

  // rect num 2
  if (!crt0 && !crt1 && crt3 && crt2) {
    p.top = null
    p.bottom = null
  }
  if (crt0 && crt1 && !crt3 && !crt2) {
    p.top = null
    p.bottom = null
  }
  if (!crt0 && crt1 && !crt3 && crt2) {
    p.left = null
    p.right = null
  }
  if (crt0 && !crt1 && crt3 && !crt2) {
    p.left = null
    p.right = null
  }

  // rect num 3
  if (!crt0 && crt1 && crt3 && crt2) {
    p.right = null
    p.bottom = null
  }
  if (crt0 && !crt1 && crt3 && crt2) {
    p.left = null
    p.bottom = null
  }
  if (crt0 && crt1 && crt3 && !crt2) {
    p.top = null
    p.left = null
  }
  if (crt0 && crt1 && !crt3 && crt2) {
    p.top = null
    p.right = null
  }

  // rect num 4
  if (crt0 && crt1 && crt3 && crt2) {
    p.top = null
    p.left = null
    p.bottom = null
    p.right = null
  }
}

// p has top, right, bottom, left p
//        top
//         |
// left -- p -- right
//         |
//       bottom
//
// create rect (4 p)
// p0 p1
// p3 p2
// c,r -> p0
// check to duplicate p
//
// start raw[0] -> c + 1
// next r + 1
function makeP(c, r, info, pList, rectList) {
  const i = r * info.column + c
  const column = info.column
  const row = info.row
  const rw = info.raw[i]
  const cc = c + 1

  if (cc > column || rw < 1) return

  const left = c
  const top = r
  const right = c + 1
  const bottom = r + 1
  const pI0 = `${left}-${top}`
  const pI1 = `${right}-${top}`
  const pI2 = `${right}-${bottom}`
  const pI3 = `${left}-${bottom}`
  // left top
  let p0 = pList.find(p => p.id === pI0)
  // right top
  let p1 = pList.find(p => p.id === pI1)
  // right bottom
  let p2 = pList.find(p => p.id === pI2)
  // left bottom
  let p3 = pList.find(p => p.id === pI3)
  if (!p0) {
    p0 = { id: pI0, c: left, r: top, top: null, right: null, bottom: null, left: null}
    pList.push(p0)
  }
  if (!p1) {
    p1 = { id: pI1, c: right, r: top, top: null, right: null, bottom: null, left: null}
    pList.push(p1)
  }
  if (!p2) {
    p2 = { id: pI2, c: right, r: bottom, top: null, right: null, bottom: null, left: null}
    pList.push(p2)
  }
  if (!p3) {
    p3 = { id: pI3, c: left, r: bottom, top: null, right: null, bottom: null, left: null}
    pList.push(p3)
  }

  checkLine(p0, pList)
  checkLine(p1, pList)
  checkLine(p2, pList)
  checkLine(p3, pList)

  rectList.push({
    id: `${c}-${r}`, i: i, c: c, r: r,
    p0: p0, p1: p1, p2: p2, p3: p3,
    rw: rw
  })
}

function checkPLine(p, pList) {
  if (p.top === null && p.right === null && p.bottom === null && p.left === null) {
    pList.splice(pList.indexOf(p), 1)
  }
}

//        top
//         |
// left -- p -- right
//         |
//       bottom
//
// find top, right, bottom, left line of p
function checkLine(p, pList) {
  const tI = `${p.c}-${p.r-1}`
  const rI = `${p.c+1}-${p.r}`
  const bI = `${p.c}-${p.r+1}`
  const lI = `${p.c-1}-${p.r}`
  const tP = pList.find(p => p.id === tI)
  const rP = pList.find(p => p.id === rI)
  const bP = pList.find(p => p.id === bI)
  const lP = pList.find(p => p.id === lI)
  if (tP) p.top = tP
  if (rP) p.right = rP
  if (bP) p.bottom = bP
  if (lP) p.left = lP
}
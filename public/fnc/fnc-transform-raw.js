// origin : drwRawInfo
// sn : ex. 2 : 1x1 to 4x4, 3 : 1x1 to 9x9
function expandRawSimple(origin, sn=2) {
  const cUCode = `raw-${getCurrentDateUCode()}`
  const cColumn = origin.column * sn
  const cRow = origin.row * sn
  const cRawNum = origin.rawNum
  const cRaw = []
  const cLength = cColumn * cRow
  const originIndices = []
  for (let i=0; i<cLength; i++) {
    cRaw.push(0)
    originIndices.push(0)
  }
  for (let i=0; i<origin.raw.length; i++) {
    const r = origin.raw[i]
    const column = i % origin.column
    const row = Math.floor(i / origin.column)
    const snColumn = column * sn
    const snRow = row * sn
    const length = sn * sn
    for (let j=0; j<length; j++) {
      const jc = j % sn
      const jr = Math.floor(j/sn)
      const ji = (snColumn + jc) + (snRow + jr) * cColumn
      cRaw[ji] = r
      originIndices[ji] = i
    }
  }
  const sInfo = {
    uCode: cUCode,
    column: cColumn,
    row: cRow,
    rawNum: cRawNum,
    raw: cRaw,
    originIndices: originIndices
  }
  return sInfo
}

// origin : drwRawInfo
// sn : ex. 2 : 1x1 to 4x4, 3 : 1x1 to 9x9
// mInfo : { target: [0], m : [] }
// target : i (origin index)
// m : matrix : ex. 2 to 2x2 matrix, 3 to 3x3 matrix
// ex. 2x2 [0,1,1,0], 3x3 [0,1,1,1,1,1,0,1,0]
function expandRawEditM(origin, sn=2, mInfoList=[]) {
  const cUCode = `raw-${getCurrentDateUCode()}`
  const cColumn = origin.column * sn
  const cRow = origin.row * sn
  const cRawNum = origin.rawNum
  const cRaw = []
  const cLength = cColumn * cRow
  const originIndices = []
  for (let i=0; i<cLength; i++) {
    cRaw.push(0)
    originIndices.push(0)
  }
  for (let i=0; i<origin.raw.length; i++) {
    const r = origin.raw[i]
    const column = i % origin.column
    const row = Math.floor(i / origin.column)
    const snColumn = column * sn
    const snRow = row * sn
    const length = sn * sn
    for (let j=0; j<length; j++) {
      const jc = j % sn
      const jr = Math.floor(j / sn)
      const ji = (snColumn + jc) + (snRow + jr) * cColumn
      cRaw[ji] = r
      originIndices[ji] = i
      for (const mInfo of mInfoList) {
        for (const tgt of mInfo.target) {
          if (tgt === i) {
            const mv = mInfo.m[j]
            if (mv === 0) cRaw[ji] = 0
          }
        }
      }
    }
  }
  const sInfo = {
    uCode: cUCode,
    column: cColumn,
    row: cRow,
    rawNum: cRawNum,
    raw: cRaw,
    originIndices: originIndices
  }
  return sInfo
}

// expand-v
// expand-h
// expand-target-v-h
// expand-target-v
// expand-target-h

// info: { column: 2, row: 2, raw: [1, 1, 1, 1] }
function addColumn(info, first, add=1) {
  const c = info.column
  const r = info.row
  const oRaw = info.raw
  const cc = c + add
  const cRaw = []
  const length = cc * r
  let cAdd = 0
  for (let i=0; i<length; i++) {
    const ic = i % cc
    if (ic > first && ic <= first + add) cAdd++
    const oi = i - cAdd
    cRaw.push(oRaw[oi])
  }
  return {
    uCode: `raw-${getCurrentDateUCode()}`,
    column: cc,
    row: r,
    rawNum: cc * r,
    raw: cRaw
  }
}

function addRow(info, first, add=1) {
  const c = info.column
  const r = info.row
  const oRaw = info.raw
  const cr = r + add
  const cRaw = []
  const length = c * cr
  let rAdd = 0
  let prevR = 0
  for (let i=0; i<length; i++) {
    const cc = i % c
    const rr = Math.floor(i / c)
    if (rr > first && rr <= first + add && prevR !== rr) {
      rAdd++
      prevR = rr
    }
    const oi = (rr - rAdd) * c + cc
    cRaw.push(oRaw[oi])
  }

  return {
    uCode: `raw-${getCurrentDateUCode()}`,
    column: c,
    row: cr,
    rawNum: c * cr,
    raw: cRaw
  }
}

function removeColumn(info, first, add=-1) {
  const c = info.column
  const r = info.row
  const oRaw = info.raw
  const cRaw = []
  let cc = c + add
  const dc = c - cc
  const length = cc * r
  let cAdd = 0
  let prevR = 0
  for (let i=0; i<length; i++) {
    const ccc = i % cc
    const rr = Math.floor(i / cc)
    if (cc <= first) {
      if (prevR !== rr) {
        cAdd += dc
        prevR = rr
      }
    } else {
      if (first === ccc) cAdd += dc
    }
    const oi = i + cAdd
    cRaw.push(oRaw[oi])
  }
  return {
    uCode: `raw-${getCurrentDateUCode()}`,
    column: cc,
    row: r,
    rawNum: cc * r,
    raw: cRaw
  }
}

function removeRow(info, first, add=-1) {
  const c = info.column
  const r = info.row
  const oRaw = info.raw
  const cRaw = []
  const cr = r + add
  const dr = r - cr
  const length = c * cr
  for (let i=0; i<length; i++) {
    const cc = i % c
    const rr = Math.floor(i / c)
    if (rr <= first) {
      cRaw.push(oRaw[i])
    } else {
      const oi = (rr + dr) * c + cc
      cRaw.push(oRaw[oi])
    }
  }
  return {
    uCode: `raw-${getCurrentDateUCode()}`,
    column: c,
    row: cr,
    rawNum: c * cr,
    raw: cRaw
  }
}

function getDirI(dc, dr) {
  if (dc === -1 && dr === -1) return 0
  if (dc === 0 && dr === -1) return 1
  if (dc === 1 && dr === -1) return 2
  if (dc === -1 && dr === 0) return 3
  if (dc === 0 && dr === 0) return 4
  if (dc === 1 && dr === 0) return 5
  if (dc === -1 && dr === 1) return 6
  if (dc === 0 && dr === 1) return 7
  if (dc === 1 && dr === 1) return 8
  return -1
}

function getDirInfo(dirI) {
  if (dirI === 0) return { dc: -1, dr: -1 }
  if (dirI === 1) return { dc: 0, dr: -1 }
  if (dirI === 2) return { dc: 1, dr: -1 }
  if (dirI === 3) return { dc: -1, dr: 0 }
  if (dirI === 4) return { dc: 0, dr: 0 }
  if (dirI === 5) return { dc: 1, dr: 0 }
  if (dirI === 6) return { dc: -1, dr: 1 }
  if (dirI === 7) return { dc: 0, dr: 1 }
  if (dirI === 8) return { dc: 1, dr: 1 }
  return null
}

// rotateI
//   4 5
// 3     6
// 2     7
//   1 0
function shiftByRotateI(info, rotateI) {
  const raw = info.raw
  const column = info.column
  const row = info.row
  const rRaw = []
  for (const key in raw) rRaw.push(0)
  let rColumn = column
  let rRow = row
  if (rotateI === 2 || rotateI === 3 || rotateI === 6 || rotateI === 7) {
    rColumn = row
    rRow = column
  }
  for (let i=0; i<raw.length; i++) {
    const rw = raw[i]
    let c = i % column
    let r = Math.floor(i / column)
    let rC = c
    let rR = r
    if (rotateI === 1) {
      rC = column - c - 1
      rR = r
    }
    if (rotateI === 2) { // change column -> row
      rC = row - r - 1
      rR = c
    }
    if (rotateI === 3) { // change column -> row
      rC = row - r - 1
      rR = column - c - 1
    }
    if (rotateI === 4) {
      rC = column - c - 1
      rR = row - r - 1
    }
    if (rotateI === 5) {
      rC = c
      rR = row - r - 1
    }
    if (rotateI === 6) { // change row -> column
      rC = r
      rR = column - c - 1
    }
    if (rotateI === 7) { // change row -> column
      rC = r
      rR = c
    }
    const rIndex = rR * rColumn + rC
    rRaw[rIndex] = rw
  }
  return {
    uCode: `raw-${getCurrentDateUCode()}`,
    column: rColumn,
    row: rRow,
    rawNum: rColumn * rRow,
    raw: rRaw
  }
}

// dst: distance
// c,r -> c - (dc * distance), r - (dr * distance)
function shiftRaw(info, dc, dr, dst) {
  const raw = info.raw
  const column = info.column
  const row = info.row
  const length = column * row
  const iList = []
  for (let i=0; i<length; i++) {
    const c = i % column
    const r = Math.floor(i / column)
    let rC = c - (dc * dst)
    let rR = r - (dr * dst)
    if (rC < 0) rC = 0
    if (rC >= column) rC = column - 1
    if (rR < 0) rR = 0
    if (rR >= row) rR = row - 1
    const index = rR * column + rC
    iList.push(index)
  }
  const sRaw = []
  for (const index of iList) {
    sRaw.push(raw[index])
  }
  return {
    uCode: `raw-${getCurrentDateUCode()}`,
    column: column,
    row: row,
    rawNum: info.rawNum,
    raw: sRaw
  }
}

// iList
// 0 1 2
// 3 4 5
// 6 7 8
// raw
//  0  1  2  3
//  4  5  6  7
//  8  9 10 11
// 12 13 14 15
function changeShapeRaw(iList, iRow, iColumn, iSr, iSc, info) {
  const raw = info.raw
  const column = info.column
  const row = info.row
  const sRaw = []
  for (const rw of raw) sRaw.push(rw)
  for (let i=0; i<iList.length; i++) {
    const ic = i % iColumn
    const ir = Math.floor(i / iColumn)
    const iIndex = iList[i]
    const oc = ic + iSc
    const or = ir + iSr
    if (oc >= column || or >= row || oc < 0 || or < 0) continue
    const oIndex = or * column + oc
    if (iIndex < 0) {
      sRaw[oIndex] = 0
      continue
    }
    const cIc = iIndex % iColumn
    const cIr = Math.floor(iIndex / iColumn)
    const cOc = cIc + iSc
    const cOr = cIr + iSr
    if (cOc >= column || cOr >= row || cOc < 0 || cOr < 0) continue
    const cIndex = cOr * column + cOc
    sRaw[oIndex] = raw[cIndex]
  }
  return {
    uCode: `raw-${getCurrentDateUCode()}`,
    column: column,
    row: row,
    rawNum: info.rawNum,
    raw: sRaw
  }
}

// reInfo: replace rawInfo
// sc, sr: start c, r of reInfo on info,
// info: target rawInfo
function replaceShapeRaw(reInfo, sc, sr, info) {
  const rRaw = structuredClone(info.raw)
  for (let i=0; i<reInfo.raw.length; i++) {
    const rw = reInfo.raw [i]
    const reC = i % reInfo.column
    const reR = Math.floor(i / reInfo.column)
    const c = reC + sc
    const r = reR + sr
    if (c >= info.column || r >= info.row) continue
    const index = r * info.column + c
    rRaw[index] = rw
  }
  return {
    uCode: `raw-${getCurrentDateUCode()}`,
    column: info.column,
    row: info.row,
    rawNum: info.rawNum,
     raw: rRaw
  }
}
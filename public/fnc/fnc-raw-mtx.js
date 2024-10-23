// 3x3 mtxSet
// m: [1,1,1,1,1,1,1,1,1]
// mtxSetList = [m, m, m, ... m]
// [0]: dot
// [1]: topEdge
// [2]: leftEdge
// [3]: bottomEdge
// [4]: rightEdge
// [5]: leftTop
// [6]: leftBottom
// [7]: rightBottom
// [8]: rightTop
// [9]: hCLine (horizontal center line)
// [10]: vCLine (vertical center line)
// [11]: topLine
// [12]: leftLine
// [13]: bottomLine
// [14]: rightLine
function checkRawCorner(i, rw, info) {
  const raw = info.raw
  const column = info.column
  const row = info.row
  if (rw === 0) return -1
  const c = i % column
  const r = Math.floor(i / column)
  let isEL = false
  let isER = false
  let isET = false
  let isEB = false
  let index = -1
  let rww = -1
  // check left
  const lc = c - 1
  if (lc >= 0) {
    index = lc + r * column
    if (index < raw.length) {
      rww = raw[index]
      if (rww === 0) isEL = true
    }
  } else {
    isEL = true
  }
  // check right
  const rc = c + 1
  if (rc < column) {
    index = rc + r * column
    if (index < raw.length) {
      rww = raw[index]
      if (rww === 0) isER = true
    }
  } else {
    isER = true
  }
  // check top
  const tr = r - 1
  if (tr >= 0) {
    index = c + tr * column
    if (index < raw.length) {
      rww = raw[index]
      if (rww === 0) isET = true
    }
  } else {
    isET = true
  }
  // check bottom
  const br = r + 1
  if (br < row) {
    index = c + br * column
    if (index < raw.length) {
      rww = raw[index]
      if (rww === 0) isEB = true
    }
  } else {
    isEB = true
  }
  if (!isEL && !isER && !isET && !isEB) return -1 // inner rw, for bSet
  if (isEL && isER && isET && isEB) return 0 // dot
  if (isEL && isER && isET && !isEB) return 1 // topEdge
  if (isEL && !isER && isET && isEB) return 2 // leftEdge
  if (isEL && isER && !isET && isEB) return 3 // bottomEdge
  if (!isEL && isER && isET && isEB) return 4 // rightEdge
  if (isEL && !isER && isET && !isEB) return 5 // leftTop
  if (isEL && !isER && !isET && isEB) return 6 // leftBottom
  if (!isEL && isER && !isET && isEB) return 7 // rightBottom
  if (!isEL && isER && isET && !isEB) return 8 // rightTop
  if (!isEL && !isER && isET && isEB) return 9 // hCLine
  if (isEL && isER && !isET && !isEB) return 10 // vCLine
  if (!isEL && !isER && isET && !isEB) return 11 // topLine
  if (isEL && !isER && !isET && !isEB) return 12 // leftLine
  if (!isEL && !isER && !isET && isEB) return 13 // bottomLine
  if (!isEL && isER && !isET && !isEB) return 14 // rightLine
  return -2
}

// check corner and change to mtx (matrix) shape
// m of mtxSetList, bSet: column = snC, row = snR
function expandRawAndChangeByMtxSet(origin, snC, snR, mtxSetList=[], bSet=[]) {
  const cUCode = `raw-${getCurrentDateUCode()}`
  const cColumn = origin.column * snC
  const cRow = origin.row * snR
  const cRawNum = origin.rawNum
  const cRaw = []
  const cLength = cRow * cColumn
  const originIndices = []
  for (let i=0; i<cLength; i++) {
    cRaw.push(0)
    originIndices.push(0)
  }
  for (let i=0; i<origin.raw.length; i++) {
    const rw = origin.raw[i]
    const column = i % origin.column
    const row = Math.floor(i / origin.column)
    const snColumn = column * snC
    const snRow = row * snR
    const length = snC * snR
    const check = checkRawCorner(i, rw, origin)
    for (let j=0; j<length; j++) {
      const jc = j % snC
      const jr = Math.floor(j / snC)
      const ji = (snColumn + jc) + (snRow + jr) * cColumn
      cRaw[ji] = rw
      originIndices[ji] = i
      if (check < -1) continue
      if (check === -1) {
        if (bSet.length > 0) {
          const b = bSet[j]
          if (b === 0) cRaw[ji] = 0
        }
        continue
      }
      const mtx = mtxSetList[check]
      const mv = mtx[j]
      if (mv === 0) cRaw[ji] = 0
    }
  }
  return {
    uCode: cUCode,
    column: cColumn,
    row: cRow,
    rawNum: cRawNum,
    raw: cRaw,
    originIndices: originIndices
  }
}

function getMtxIndexByKey(key) {
  if (key === 'dot') return 0
  if (key === 'topEdge') return 1
  if (key === 'leftEdge') return 2
  if (key === 'bottomEdge') return 3
  if (key === 'rightEdge') return 4
  if (key === 'leftTop') return 5
  if (key === 'leftBottom') return 6
  if (key === 'rightBottom') return 7
  if (key === 'rightTop') return 8
  if (key === 'hCLine') return 9
  if (key === 'vCLine') return 10
  if (key === 'topLine') return 11
  if (key === 'leftLine') return 12
  if (key === 'bottomLine') return 13
  if (key === 'rightLine') return 14
  return -1
}

// list = [{key: 'topEdge', m: [1,1,0,1,1,0]}]
function createSimpleMtxSetList(column, row, list) {
  const length = column * row
  const mtxSetList = []
  for (let i=0; i<15; i++) {
    const m = []
    for (let j=0; j<length; j++) m.push(1)
    mtxSetList.push(m)
  }
  for (const info of list) {
    const index = getMtxIndexByKey(info.key)
    if (index > 0) mtxSetList[index] = info.m
  }
  return mtxSetList
}
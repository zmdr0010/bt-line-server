// uCode/orderSet uCode/x interval/y interval/width (0: fill, 1 ~ n: lineWidth)/color/option
// option: scale, rotate, shift ...
//    /rotate/degree
//    /scale/scaleX/scaleY
//    /shiftRotateI/rotateI
//    ...
function createSimpleLineInfoFromDrwOrderSet(setStr, orderSetList) {
  const setStrSplit = setStr.split('/')
  const uCode = setStrSplit[0]
  const orderUCode = setStrSplit[1]
  const intervalX = Number(setStrSplit[2])
  const intervalY = Number(setStrSplit[3])
  const width = Number(setStrSplit[4])
  const color = setStrSplit[5]
  const orderSet = orderSetList.find(s => s.split('/')[0] === orderUCode)
  const orderInfo = createOrderInfo(orderSet)
  let lineInfo = createSimpleLineInfoFromOrderInfo(uCode, orderInfo, intervalX, intervalY, width, color)
  // if (setStrSplit.length >= 7) { // option
  //   const type = setStrSplit[6]
  //   if (type === 'rotate') lineInfo = rotateInfo(lineInfo, degreeToRadian(Number(setStrSplit[7])))
  //   if (type === 'scale') lineInfo = createLineInfoByScale(lineInfo, Number(setStrSplit[7]), Number(setStrSplit[8]))
  //   if (type === 'shiftRotateI') lineInfo = shiftByRotateI(lineInfo, Number(setStrSplit[7]))
  // }
  return lineInfo
}

// uCode/num/orderSet uCode/x interval/ y interval/width/color/x/y/... list
function createSimpleLineInfoFromPlaceDrwOrderSet(set, orderSetList) {
  const setStrSplit = set.split('/')
  const uCode = setStrSplit[0]
  const num = Number(setStrSplit[1])
  const list = []
  for (let i=0; i<num; i++) {
    const index = i * 7 + 2
    const orderUCode = setStrSplit[index]
    const intervalX = Number(setStrSplit[index + 1])
    const intervalY = Number(setStrSplit[index + 2])
    const width = Number(setStrSplit[index + 3])
    const color = setStrSplit[index + 4]
    const x = Number(setStrSplit[index + 5])
    const y = Number(setStrSplit[index + 6])
    const orderSet = orderSetList.find(s => s.split('/')[0] === orderUCode)
    const orderInfo = createOrderInfo(orderSet)
    const lineInfo = createSimpleLineInfoFromOrderInfo(uCode, orderInfo, intervalX, intervalY, width, color)
    lineInfo.x = x
    lineInfo.y = y
    list.push(lineInfo)
  }
  const mrgLine = mergeSpLineInfo(uCode, list)
  calculateLineInfoSize(mrgLine)
  return mrgLine
}

function createSimpleLineInfoFromOrderInfo(uCode, info, intervalX, intervalY, width, color) {
  const list = []
  for (const o of info.list) {
    const x = o.c * intervalX
    const y = o.r * intervalY
    list.push({
      x: x, y: y
    })
  }
  const lineInfo = {
    uCode: uCode,
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    list: [
      {
        width: width,
        color: color,
        list: list
      }
    ],
    child: []
  }
  calculateLineInfoSize(lineInfo)
  return lineInfo
}

// uCode/column/row/ 0 or line order list (ex. 0,0,1,0,2,0,3, ... 0: none, 1 ~ n: order)
// uCode/column/row/ - or line order list (ex. -,-,1,-,2,-,3, ... -: none, 1 ~ n: order)
function createOrderInfo(str) {
  const strSplit = str.split('/')
  const uCode = strSplit[0]
  const column = Number(strSplit[1])
  const row = Number(strSplit[2])
  const oStr = strSplit[3]
  const oStrSplit = oStr.split(',')
  const list = []
  for (let i=0; i<oStrSplit.length; i++) {
    if (oStrSplit[i] === '-') continue
    const n = Number(oStrSplit[i])
    if (n > 0) {
      const c = i % column
      const r = Math.floor(i / column)
      list.push({
        order: n,
        c: c,
        r: r
      })
    }
  }
  list.sort((a, b) => a.order - b.order)
  const first = structuredClone(list[0])
  list.push(first)
  return {
    uCode: uCode,
    column: column,
    row: row,
    list: list
  }
}
// override pInfo
// uCode/column/row/ - or point order list (ex. -,-,1,-,2,-,3, ... -: none, 0 ~ n: order)
// itvX, itvY - interval x, interval y
function createShapePointInfo(set, itvX, itvY) {
  const setSplit = set.split('/')
  const uCode = setSplit[0]
  const column = Number(setSplit[1])
  const row = Number(setSplit[2])
  const str = setSplit[3]
  const strSplit = str.split(',')
  const list = []
  let index = -1
  for (const pi of strSplit) {
    index++
    if (pi === '-') continue
    const i = Number(pi)
    const c = index % column
    const r = Math.floor(index / column)
    const x = c * itvX
    const y = r * itvY
    list.push({ i: i, c: c, r: r, x: x, y: y })
  }
  return {
    uCode: uCode,
    column: column,
    row: row,
    list: list
  }
}

// override lineInfo
// uCode/point uCode/shape num/pI,pI,pI/pI,pI ... list
// itvX, itvY - interval x, interval y
function createSimpleShapeInfo(set, pointSetList, itvX, itvY, width=1, color='black') {
  const setSplit = set.split('/')
  const uCode = setSplit[0]
  const pointUCode = setSplit[1]
  const pointSet = pointSetList.find(st => st.split('/')[0] === pointUCode)
  const pointInfo = createShapePointInfo(pointSet, itvX, itvY)
  const num = Number(setSplit[2])
  const list = []
  for (let i=3; i<setSplit.length; i++) {
    const str = setSplit[i]
    const strSplit = str.split(',')
    const pList = []
    let firstP = null
    for (const pIStr of strSplit) {
      const pi = Number(pIStr)
      const pInfo = pointInfo.list.find(p => p.i === pi)
      pList.push(pInfo)
      if (!firstP) firstP = pInfo
    }
    pList.push(firstP)
    // default set: width 1, black
    list.push({ width: width, color: color, list: pList })
  }
  const shapeInfo = {
    uCode: uCode,
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    pointInfo: pointInfo,
    list: list,
    child: [],
    itvX: itvX,
    itvY: itvY
  }
  calculateLineInfoSize(shapeInfo)
  return shapeInfo
}

// uCode/shape uCode/intervalX/intervalY/num/shapeI,width,color/shapeI,width,color ... list
function createShapeInfoFromDrwSet(set, shapeSetList, pointSetList) {
  const setSplit = set.split('/')
  const uCode = setSplit[0]
  const shapeUCode = setSplit[1]
  const shapeSet = shapeSetList.find(st => st.split('/')[0] === shapeUCode)
  const itvX = Number(setSplit[2])
  const itvY = Number(setSplit[3])
  const shapeInfo = createSimpleShapeInfo(shapeSet, pointSetList, itvX, itvY)
  const num = Number(setSplit[4])
  for (let i=5; i<setSplit.length; i++) {
    const str = setSplit[i]
    const strSplit = str.split(',')
    const shapeI = Number(strSplit[0])
    const width = Number(strSplit[1])
    const color = strSplit[2]
    const shape = shapeInfo.list[shapeI]
    shape.width = width
    shape.color = color
  }
  shapeInfo.uCode = uCode
  return shapeInfo
}

// uCode/draw shape uCode/num/pI,dx,dy/pI,dx,dy/ ... list
function createShapeInfoFromTransSet(set, drwSetList, shapeSetList, pointSetList) {
  const setSplit = set.split('/')
  const uCode = setSplit[0]
  const drwUCode = setSplit[1]
  const drwSet = drwSetList.find(st => st.split('/')[0] === drwUCode)
  const shapeInfo = createShapeInfoFromDrwSet(drwSet, shapeSetList, pointSetList)
  const num = Number(setSplit[2])
  for (let i=3; i<setSplit.length; i++) {
    const str = setSplit[i]
    const strSplit = str.split(',')
    const pi = Number(strSplit[0])
    const dx = Number(strSplit[1])
    const dy = Number(strSplit[2])
    const pInfo = shapeInfo.pointInfo.list.find(p => p.i === pi)
    pInfo.x += dx
    pInfo.y += dy
  }
  shapeInfo.uCode = uCode
  fitSimpleLineInfo(shapeInfo)
  return shapeInfo
}

// uCode/draw shape uCode/num/shapeI,width,color/shapeI,width,color ... list
function createShapeInfoFromColoringSet(set, drwSetList, shapeSetList, pointSetList) {
  const setSplit = set.split('/')
  const uCode = setSplit[0]
  const drwUCode = setSplit[1]
  const drwSet = drwSetList.find(st => st.split('/')[0] === drwUCode)
  const shapeInfo = createShapeInfoFromDrwSet(drwSet, shapeSetList, pointSetList)
  const num = Number(setSplit[2])
  for (let i=3; i<setSplit.length; i++) {
    const str = setSplit[i]
    const strSplit = str.split(',')
    const shapeI = strSplit[0]
    const width = Number(strSplit[1])
    const color = strSplit[2]
    const shp = shapeInfo.list[shapeI]
    shp.width = width
    shp.color = color
  }
  shapeInfo.uCode = uCode
  return shapeInfo
}

// list: [{ i:0, dx:10, dy:-10 }]
// i: pI
function transShapeInfo(shapeInfo, list) {
  for (const t of list) {
    const p = shapeInfo.pointInfo.list[t.i]
    p.x += t.dx
    p.y += t.dy
  }
}

// list: [{ i:0, width: 0, color: 'red }]
// i: shapeI
function coloringShapeInfo(shapeInfo, list) {
  for (const c of list) {
    const shp = shapeInfo.list[c.i]
    shp.width = c.width
    shp.color = c.color
  }
}

// uCode/shape uCode/intervalX/intervalY/num/shapeI,width,color/shapeI,width,color ... list
function createSimpleDrwShapeSet(shapeUCode, itvX, itvY, num) {
  let str = `drw-shape-${getCurrentDateUCode()}/${shapeUCode}/${itvX}/${itvY}/${num}`
  for (let i=0; i<num; i++) {
    str += `/${i},1,black`
  }
  return str
}

// shape point set
// uCode/column/row/ - or point order list (ex. -,-,1,-,2,-,3, ... -: none, 0 ~ n: order)
// shape set
// uCode/point uCode/shape num/pI,pI,pI/pI,pI ... list
// info: shapeInfo
function createStrSetShapeAndPoint(info) {
  let shpSet = `${info.uCode}/${info.pointInfo.uCode}/${info.list.length}`
  for (const dw of info.list) {
    shpSet += '/'
    for (const p of dw.list) shpSet += `${p.i},`
    shpSet = shpSet.slice(0, shpSet.length-1)
  }
  let pointSet = `${info.pointInfo.uCode}/${info.pointInfo.column}/${info.pointInfo.row}/`
  for (let r=0; r<info.pointInfo.row; r++) {
    for (let c=0; c<info.pointInfo.column; c++) {
      const p = info.pointInfo.list.find(p => p.c === c && p.r === r)
      if (p) {
        pointSet += `${p.i},`
      } else {
        pointSet += `-,`
      }
    }
  }
  pointSet = pointSet.slice(0, pointSet.length-1)
  const shp = structuredClone(info)
  calculateLineInfoSize(shp)
  shp.uCode = `line-from-shp-${getCurrentDateUCode()}`
  return { shpSet: shpSet, pointSet: pointSet, lineSet: createSimpleLineStrSet(shp) }
}
function createEditPStrSet(info) {
  return `${info.uCode}/${info.rawUCode}/${info.szw}/${info.szh}/${info.color}/${info.lineColor}/${info.lineWidth}/${info.editType}/${info.iList.length}/${info.iList.join(',')}/${info.edgeTypeList.length}/${info.edgeTypeList.join(',')}`
}

// edit-p-set
// uCode/raw uCode/szw/szh/color/lineColor/lineWidth/edit type/i num/i,i,i, ... list/edge type num/edge type,type ... list
function createEditPSetInfo(set) {
  const split = set.split('/')
  const uCode = split[0]
  const rawUCode = split[1]
  const szw = Number(split[2])
  const szh = Number(split[3])
  const color = split[4]
  const lineColor = split[5]
  const lineWidth = Number(split[6])
  const editType = split[7]
  const iNum = Number(split[8])
  const iList = []
  if (iNum > 0) {
    const iStr = split[9]
    const iSplit = iStr.split(',')
    for (const ist of iSplit) iList.push(Number(ist))
  }
  const edgeTypeNum = Number(split[10])
  const edgeTypeList = []
  if (edgeTypeNum > 0) {
    const tStr = split[11]
    const tSplit = tStr.split(',')
    for (const t of tSplit) edgeTypeList.push(t)
  }
  return {
    uCode: uCode,
    rawUCode: rawUCode,
    szw: szw,
    szh: szh,
    color: color,
    lineColor: lineColor,
    lineWidth: lineWidth,
    editType: editType,
    iList: iList,
    edgeTypeList: edgeTypeList
  }
}

function createLineInfoFromEditPSetInfo(info, rawInfoList) {
  const rawInfo = rawInfoList.find(r => r.uCode === info.rawUCode)
  if (!rawInfo) return
  const pList = calculatePList(rawInfo)
  const linePList = []
  makeLinePList(pList[0], linePList, info.szw, info.szh)
  let lineInfo
  if (info.editType === 'remove-p') {
    const ed = editOutPInfoList(linePList, info.szw, info.szh, info.iList, info.editType)
    lineInfo = createLinePointFromOutlinePList(ed, info.color, info.lineColor, info.lineWidth)
  } else {
    const ed = editPListEdgeInOutSide(linePList, info.szw, info.szh, 'target', info.editType, { iList: info.iList, list: info.edgeTypeList })
    lineInfo = createLinePointFromOutlinePList(ed, info.color, info.lineColor, info.lineWidth)
  }
  return lineInfo
}

// uCode/num/pSet uCode,x,y/pSet uCode,x,y/ ... list
function createEditPPlaceStrSet(info) {
  let str = `${info.uCode}/${info.list.length}`
  for (const p of info.list) {
    str += `/${p.pSetInfo.uCode},${p.x},${p.y}`
  }
  return str
}

function createEditPPlaceInfo(set, pSetInfoList, isNew=false) {
  const split = set.split('/')
  const uCode = split[0]
  const num = Number(split[1])
  const list = []
  for (let i=2; i<split.length; i++) {
    const str = split[i]
    const strSplit = str.split(',')
    const pSetUCode = strSplit[0]
    const x = Number(strSplit[1])
    const y = Number(strSplit[2])
    let pSet = pSetInfoList.find(p => p.uCode === pSetUCode)
    if (!pSet) pSet = createEmptyPlaceInfo()
    if (isNew) pSet.uCode = `edit-p-set-${getCurrentDateUCode()}-${i-2}`
    list.push({ x: x, y: y, pSetInfo: pSet, lineInfo: null })
  }
  return {
    uCode: uCode,
    list: list
  }
}

function fitPlaceInfo(info) {
  let minX = 100000
  let minY = 100000
  for (const p of info.list) {
    const x = p.x
    const y = p.y
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
  }
  const mx = 0 - minX
  const my = 0 - minY
  console.log(`mx: ${mx}, my: ${my}`)
  if (mx !== 0 || my !== 0) {
    for (const p of info.list) {
      p.x += mx
      p.y += my
    }
  }
}

function calculatePlaceInfoSize(info) {
  let maxX = 0
  let maxY = 0
  for (const p of info.list) {
    if (p.lineInfo) {
      const x = p.lineInfo.x + p.lineInfo.w
      const y = p.lineInfo.y + p.lineInfo.h
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  }
  return { w: maxX, h: maxY }
}

function makeLine(placeInfo, rawSetList) {
  const rawUCode = placeInfo.pSetInfo.rawUCode
  const szw = placeInfo.pSetInfo.szw
  const szh = placeInfo.pSetInfo.szh
  const color = placeInfo.pSetInfo.color
  const lineColor = placeInfo.pSetInfo.lineColor
  const lineWidth = placeInfo.pSetInfo.lineWidth
  const editType = placeInfo.pSetInfo.editType
  const iList = placeInfo.pSetInfo.iList
  const edgeList = placeInfo.pSetInfo.edgeTypeList
  const rawSet = rawSetList.find(s => s.split('/')[0] === rawUCode)
  const rawInfo = createRawInfo(rawSet)
  const pList = calculatePList(rawInfo)
  const linePList = []
  makeLinePList(pList[0], linePList, szw, szh)
  let line = createLinePointFromOutlinePList(linePList, color, lineColor, lineWidth)

  if (editType === 'remove-p' && iList.length > 0) {
    const editList = editOutPInfoList(linePList, szw, szh, iList, editType)
    line = createLinePointFromOutlinePList(editList, color, lineColor, lineWidth)
  }

  if (editType !== 'none' && editType !== 'remove-p' && edgeList.length > 0) {
    const editList = editPListEdgeInOutSide(linePList, szw, szh, 'target', editType, { iList: [], list: edgeList })
    line = createLinePointFromOutlinePList(editList, color, lineColor, lineWidth)
  }

  line.x = placeInfo.x
  line.y = placeInfo.y
  placeInfo.lineInfo = line
}

function makeLineByRawInfo(placeInfo, rawInfo) {
  const szw = placeInfo.pSetInfo.szw
  const szh = placeInfo.pSetInfo.szh
  const color = placeInfo.pSetInfo.color
  const lineColor = placeInfo.pSetInfo.lineColor
  const lineWidth = placeInfo.pSetInfo.lineWidth
  const editType = placeInfo.pSetInfo.editType
  const iList = placeInfo.pSetInfo.iList
  const edgeList = placeInfo.pSetInfo.edgeTypeList
  const pList = calculatePList(rawInfo)
  const linePList = []
  placeInfo.pSetInfo.rawUCode = rawInfo.uCode
  makeLinePList(pList[0], linePList, szw, szh)
  let line = createLinePointFromOutlinePList(linePList, color, lineColor, lineWidth)

  if (editType === 'remove-p' && iList.length > 0) {
    const editList = editOutPInfoList(linePList, szw, szh, iList, editType)
    line = createLinePointFromOutlinePList(editList, color, lineColor, lineWidth)
  }

  if (editType !== 'none' && editType !== 'remove-p' && edgeList.length > 0) {
    const editList = editPListEdgeInOutSide(linePList, szw, szh, 'target', editType, { iList: [], list: edgeList })
    line = createLinePointFromOutlinePList(editList, color, lineColor, lineWidth)
  }

  line.x = placeInfo.x
  line.y = placeInfo.y
  placeInfo.lineInfo = line
}

function createEmptyPlaceInfo() {
  return {
    x: 0,
    y: 0,
    pSetInfo: {
      uCode: `edit-p-set-${getCurrentDateUCode()}`,
      rawUCode: '',
      szw: 20,
      szh: 20,
      color: 'white',
      lineColor: 'black',
      lineWidth: 1,
      editType: 'none',
      iList: [],
      edgeTypeList: []
    },
    lineInfo: null
  }
}
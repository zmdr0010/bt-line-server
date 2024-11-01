// uCode/lineUCode/sftRI/scaleX,scaleY/degree/ltX,ltY,rtX,rtY,rbX,rbY,lbX,lbY
// no p4 edit -> length 5
// default: sftRI = 0, scaleX = 1, scaleY = 1, degree = 0 <- no transform
function createLineEditInfo(set, lineSetList) {
  const split = set.split('/')
  const uCode = split[0]
  const lineUCode = split[1]
  const sftRI = Number(split[2])
  const scStr = split[3]
  const scSplit = scStr.split(',')
  const scaleX = Number(scSplit[0])
  const scaleY = Number(scSplit[1])
  const degree = Number(split[4])
  const p4Info = {
    isOn: false,
    lt: {
      x: 0,
      y: 0
    },
    rt: {
      x: 100,
      y: 0
    },
    rb: {
      x: 100,
      y: 100
    },
    lb: {
      x: 0,
      y: 100
    }
  }
  if (split.length > 5) {
    const p4Str = split[5]
    const p4Split = p4Str.split(',')
    p4Info.lt.x = Number(p4Split[0])
    p4Info.lt.y = Number(p4Split[1])
    p4Info.rt.x = Number(p4Split[2])
    p4Info.rt.y = Number(p4Split[3])
    p4Info.rb.x = Number(p4Split[4])
    p4Info.rb.y = Number(p4Split[5])
    p4Info.lb.x = Number(p4Split[6])
    p4Info.lb.y = Number(p4Split[7])
    p4Info.isOn = true
  }
  const lineSet = lineSetList.find(s => s.split('/')[0] === lineUCode)
  const lineInfo = createSimpleLineInfo(lineSet)

  const editInfo = {
    uCode: uCode,
    lineInfo: lineInfo,
    transLine: null,
    scaleInfo: {
      scaleX: scaleX,
      scaleY: scaleY
    },
    rotateInfo: {
      degree: degree
    },
    sftRIInfo: {
      i: sftRI,
      list: [0,1,2,3,4,5,6,7]
    },
    p4Info: p4Info
  }

  return editInfo
}

// uCode/lineUCode/sftRI/scaleX,scaleY/degree/ltX,ltY,rtX,rtY,rbX,rbY,lbX,lbY
// no p4 edit -> length 5
// default: sftRI = 0, scaleX = 1, scaleY = 1, degree = 0 <- no transform
function createLineEditStrSet(info, saveP4=false) {
  let str = `${info.uCode}/${info.lineInfo.uCode}/${info.sftRIInfo.i}/${info.scaleInfo.scaleX},${info.scaleInfo.scaleY}/${info.rotateInfo.degree}`
  if (saveP4) str += `/${info.p4Info.lt.x},${info.p4Info.lt.y},${info.p4Info.rt.x},${info.p4Info.rt.y},${info.p4Info.rb.x},${info.p4Info.rb.y},${info.p4Info.lb.x},${info.p4Info.lb.y}`
  return str
}

// edit order: 1.sftRI, 2.scale, 3.degree
// p4: independent work
function editByOrder(editInfo) {
  let lineInfo = editInfo.lineInfo
  editInfo.transLine = createShiftRotateILineInfo(lineInfo, editInfo.sftRIInfo.i)
  lineInfo = editInfo.transLine
  editInfo.transLine = createScaledLineInfo(lineInfo, editInfo.scaleInfo.scaleX, editInfo.scaleInfo.scaleY)
  lineInfo = editInfo.transLine
  editInfo.transLine = createRotateLineInfo(lineInfo, degreeToRadian(editInfo.rotateInfo.degree))
  fitSimpleLineInfo(editInfo.transLine)
}

// sftRI/scaleX,scaleY/degree/ltX,ltY,rtX,rtY,rbX,rbY,lbX,lbY
// no p4 edit -> length 3
// default: sftRI = 0, scaleX = 1, scaleY = 1, degree = 0 <- no transform
function createLineEditInfoFromPSet(set) {
  const split = set.split('/')
  const sftRI = Number(split[0])
  const scStr = split[1]
  const scSplit = scStr.split(',')
  const scaleX = Number(scSplit[0])
  const scaleY = Number(scSplit[1])
  const degree = Number(split[2])
  const p4Info = {
    isOn: false,
    lt: {
      x: 0,
      y: 0
    },
    rt: {
      x: 100,
      y: 0
    },
    rb: {
      x: 100,
      y: 100
    },
    lb: {
      x: 0,
      y: 100
    }
  }
  if (split.length > 3) {
    const p4Str = split[3]
    const p4Split = p4Str.split(',')
    p4Info.lt.x = Number(p4Split[0])
    p4Info.lt.y = Number(p4Split[1])
    p4Info.rt.x = Number(p4Split[2])
    p4Info.rt.y = Number(p4Split[3])
    p4Info.rb.x = Number(p4Split[4])
    p4Info.rb.y = Number(p4Split[5])
    p4Info.lb.x = Number(p4Split[6])
    p4Info.lb.y = Number(p4Split[7])
    p4Info.isOn = true
  }

  const editInfo = {
    uCode: `line-edit-${getCurrentDateUCode()}`,
    lineInfo: null,
    transLine: null,
    scaleInfo: {
      scaleX: scaleX,
      scaleY: scaleY
    },
    rotateInfo: {
      degree: degree
    },
    sftRIInfo: {
      i: sftRI,
      list: [0,1,2,3,4,5,6,7]
    },
    p4Info: p4Info
  }

  return editInfo
}

// to save to editPSet
// /sftRI/scaleX,scaleY/degree/ltX,ltY,rtX,rtY,rbX,rbY,lbX,lbY
// no p4 edit -> length 3
// default: sftRI = 0, scaleX = 1, scaleY = 1, degree = 0 <- no transform
function createLineEditStrSetNoUCode(info, saveP4=false) {
  let str = `/${info.sftRIInfo.i}/${info.scaleInfo.scaleX},${info.scaleInfo.scaleY}/${info.rotateInfo.degree}`
  if (saveP4) str += `/${info.p4Info.lt.x},${info.p4Info.lt.y},${info.p4Info.rt.x},${info.p4Info.rt.y},${info.p4Info.rb.x},${info.p4Info.rb.y},${info.p4Info.lb.x},${info.p4Info.lb.y}`
  return str
}
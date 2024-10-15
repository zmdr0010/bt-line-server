function createSimplePartInfo(uCode, tCode, lineInfo, x=0, y=0) {
  const w = lineInfo.w
  const h = lineInfo.h

  return {
    uCode: uCode,
    w: w,
    h: h,
    x: x,
    y: y,
    tCode: tCode,
    lineInfo: lineInfo,
    order: [],
    child: []
  }
}

function createSimpleRectLineInfo(uCode, w, h, color='black', width=1) {
  const lineInfo = {
    uCode: uCode,
    w: w,
    h: h,
    x: 0,
    y: 0,
    list: [
      {
        width: width, // 0: (fill), 1 ~ n: (stroke), lineWidth
        color: color,
        // points: [0,0, 200,0, 200,70, 120,70, 120,150, 80,150, 80,70, 0,70, 0,0],
        list: [ // pointInfo list
          // draw x, y <- x + dx, y + dy
          {x:0,y:0,dx:0,dy:0}, {x:w,y:0,dx:0,dy:0}, {x:w,y:h,dx:0,dy:0},
          {x:0,y:h,dx:0,dy:0}, {x:0,y:0,dx:0,dy:0},
        ]
      }
    ],
    child: []
  }
  return lineInfo
}

function calculateToJrcInfo(partInfoList, calcJrcInfo) {
  const list = []
  for (const cjInfo of calcJrcInfo.list) {
    const partInfo = partInfoList.find(info => info.tCode === cjInfo.target)
    const x = partInfo.w * cjInfo.scx
    const y = partInfo.h * cjInfo.scy
    // console.log(`w: ${partInfo.w}, h: ${partInfo.h}, scx: ${cjInfo.scx}, scy: ${cjInfo.scy}, x: ${x}, y: ${y}`)
    list.push({
      target: cjInfo.target,
      key: cjInfo.key,
      type: cjInfo.jrcType,
      x: x,
      y: y
    })
  }
  return list
}

function moveByJrcInfo(partInfoList, jrcInfoList) {
  for (const jrcInfo of jrcInfoList) {
    if (jrcInfo.type === 'm') {
      const gJrcInfo = jrcInfoList.find(info => info.key === jrcInfo.key && info.type === 'g')
      const gPartInfo = partInfoList.find(info => info.tCode === gJrcInfo.target)
      const mPartInfo = partInfoList.find(info => info.tCode === jrcInfo.target)
      mPartInfo.x = gPartInfo.x + gJrcInfo.x - jrcInfo.x
      mPartInfo.y = gPartInfo.y + gJrcInfo.y - jrcInfo.y
      console.log(`x: ${mPartInfo.x} = ${gPartInfo.x} + ${gJrcInfo.x} - ${jrcInfo.x}`)
      console.log(`y: ${mPartInfo.y} = ${gPartInfo.y} + ${gJrcInfo.y} - ${jrcInfo.y}`)
    }
  }
}

function calculateLastXY(partInfo, lastX, lastY, x, y) {
  const lx = partInfo.x + partInfo.w + x
  const ly = partInfo.y + partInfo.h + y
  let lstX = Math.max(lastX, lx)
  let lstY = Math.max(lastY, ly)
  for (const childInfo of partInfo.child) {
    let cLst = calculateLastXY(childInfo, lstX, lstY, x + partInfo.x, y + partInfo.y)
    lstX = Math.max(lstX, cLst[0])
    lstY = Math.max(lstY, cLst[1])
  }
  return [lstX, lstY]
}

function calculatePartSize(partInfo) {
  const x = partInfo.x
  const y = partInfo.y
  const calcXY = calculateLastXY(partInfo, 0, 0, 0, 0)
  const lastX = calcXY[0]
  const lastY = calcXY[1]
  partInfo.w = lastX - x
  partInfo.h = lastY - y
}

function moveAutoJoin(partInfo, calcJrcInfo, topTCode, leftTCode) {
  // 0. auto calculate jrc (joint x y)
  const jrcInfoList = calculateToJrcInfo(partInfo.child, calcJrcInfo)

  // 1. topTCode to top (y = 0)
  const tPart = partInfo.child.find(info => info.tCode === topTCode)
  tPart.y = 0

  // 2. m to g
  moveByJrcInfo(partInfo.child, jrcInfoList)

  // 3. leftTCode to left => other parts to left
  const lPart = partInfo.child.find(info => info.tCode === leftTCode)
  const mx = 0 - lPart.x
  for (const c of partInfo.child) {
    c.x += mx
  }

  // 4. re calculate w, h
  partInfo.w = 0
  partInfo.h = 0
  calculatePartSize(partInfo)
}

function createDevicePart(deviceSet, lineSetList) {
  const calcJrc = {
    uCode: `calc-jrc-${deviceSet.uCode}`,
    list: structuredClone(deviceSet.calcJrcInfo.list)
  }
  const part = {
    uCode: deviceSet.uCode,
    w: 100,
    h: 100,
    x: 0,
    y: 0,
    tCode: deviceSet.tCode,
    lineInfo: null,
    child: []
  }

  for (const c of deviceSet.child) {
    if (c.jrcInfo) {
      for (const jrc of c.jrcInfo.list) {
        const oJrc = calcJrc.list.find(j => j.target === jrc.target && j.key === jrc.key)
        oJrc.scx = jrc.scx
        oJrc.scy = jrc.scy
      }
    }
    const lineSet = lineSetList.find(s => s.split('/')[0] === c.lineUCode)
    let cLine = createSimpleLineInfo(lineSet)
    if (c.transInfo) {
      for (const tr of c.transInfo.list) {
        if (tr.type === 'scale') {
          cLine = createScaledLineInfo(cLine, tr.scaleX, tr.scaleY)
        }
        if (tr.type === 'rotate') {
          cLine = createRotateLineInfo(cLine, degreeToRadian(tr.degree))
          fitSimpleLineInfo(cLine)
        }
      }
    }
    const cPart = createSimplePartInfo(c.uCode, c.tCode, cLine)
    part.child.push(cPart)
  }
  moveAutoJoin(part, calcJrc, deviceSet.calcJrcInfo.top, deviceSet.calcJrcInfo.left)

  return part
}

function createDeviceGroupPart(groupSet, lineSetList) {
  const calcJrc = {
    uCode: `calc-jrc-${groupSet.uCode}`,
    list: structuredClone(groupSet.calcJrcInfo.list)
  }
  console.log(calcJrc)
  const part = {
    uCode: groupSet.uCode,
    w: 100,
    h: 100,
    x: 0,
    y: 0,
    tCode: groupSet.tCode,
    lineInfo: null,
    child: []
  }
  for (const deviceSet of groupSet.child) {
    let p
    if (deviceSet.type === 'device-group') {
      p = createDeviceGroupPart(deviceSet, lineSetList)
    } else { // device
      p = createDevicePart(deviceSet, lineSetList)
    }
    part.child.push(p)

    if (groupSet.childInfo) {
      const cInfo = groupSet.childInfo.list.find(ci => ci.target === deviceSet.tCode)
      const jrcInfo = calcJrc.list.find(j => j.target === cInfo.target && j.key === cInfo.key)
      const cPart = p.child.find(c => c.tCode === cInfo.cTarget)
      let scx = jrcInfo.scx
      let scy = jrcInfo.scy
      if (cInfo.margin) {
        scx = cPart.x / p.w
        scy = cPart.y / p.h
        scx += cInfo.margin.scx
        scy += cInfo.margin.scy
      }
      jrcInfo.scx = scx
      jrcInfo.scy = scy
    }
  }
  moveAutoJoin(part, calcJrc, groupSet.calcJrcInfo.top, groupSet.calcJrcInfo.left)
  return part
}

// const t00Bbr0Set = {
//   uCode: '',
//   tCode: 't00-b-br0',
//   type: 'part', // device-group (unit) / device / part
//   lineUCode: '',
//   jrcInfo: {
//     list: [
//       { target: 't00-b-br0', key: 'jp-t00-b-b2-br0', jrcType: 'm', scx: 0.8, scy: 0.4 },
//       { target: 't00-b-br0', key: 'jp-t00-b-br0-br1', jrcType: 'g', scx: 0.37, scy: 0.9 }
//     ]
//   },
//   transInfo: {
//     list: [
//       {
//         type: 'scale',
//         scaleX: 0.18,
//         scaleY: 0.18
//       },
//       {
//         type: 'rotate',
//         degree: -80
//       }
//     ]
//   }
// }
// type: part
// uCode/tCode/type/lineUCode/jrc num/target,key,jrcType,scx,scy
//           /target,key, ... list /trans num/type,value,value/type,value ... list
function createPreStrSetTypePart(preSet) {
  let str = `${preSet.uCode}/${preSet.tCode}/${preSet.type}/${preSet.lineUCode}/${preSet.jrcInfo.list.length}`
  for (const jrc of preSet.jrcInfo.list) {
    str += `/${jrc.target},${jrc.key},${jrc.jrcType},${jrc.scx},${jrc.scy}`
  }
  if (!preSet.transInfo) {
    str += '/0'
  } else {
    str += `/${preSet.transInfo.list.length}`
    for (const trn of preSet.transInfo.list) {
      if (trn.type === 'scale') str += `/${trn.type},${trn.scaleX},${trn.scaleY}`
      if (trn.type === 'rotate') str += `/${trn.type},${trn.degree}`
    }
  }
  return str
}

// const t00BSet = {
//   uCode: '',
//   tCode: 't00-b',
//   type: 'device', // device-group (unit) / device / part
//   child: [
//     t00Bbr0Set, t00Bbr1Set, t00Bb2Set, t00Bb1Set, t00Bb0Set, t00Bbl0Set, t00Bbl1Set
//   ],
//   calcJrcInfo: {
//     list: [ // frame set, jrc order
//       // jrcType: m (move) / g (goal)
//       // scx, scy: scale x, scale y
//       { target: 't00-b-b0', key: 'jp-t00-b-b0-b1', jrcType: 'g', scx: 0.71, scy: 0.77 },
//       { target: 't00-b-b1', key: 'jp-t00-b-b0-b1', jrcType: 'm', scx: 0.43, scy: 0.39 },
//       { target: 't00-b-b1', key: 'jp-t00-b-b1-b2', jrcType: 'g', scx: 0.5, scy: 0.9 },
//       { target: 't00-b-b2', key: 'jp-t00-b-b1-b2', jrcType: 'm', scx: 0.5, scy: 0.25},
//       { target: 't00-b-b2', key: 'jp-t00-b-b2-br0', jrcType: 'g', scx: 0.1, scy: 0.7 },
//       { target: 't00-b-b2', key: 'jp-t00-b-b2-bl0', jrcType: 'g', scx: 0.8, scy: 0.75 },
//       { target: 't00-b-br0', key: 'jp-t00-b-b2-br0', jrcType: 'm', scx: 0.8, scy: 0.4 },
//       { target: 't00-b-br0', key: 'jp-t00-b-br0-br1', jrcType: 'g', scx: 0.37, scy: 0.9 },
//       { target: 't00-b-bl0', key: 'jp-t00-b-b2-bl0', jrcType: 'm', scx: 0.34, scy: 0.3 },
//       { target: 't00-b-bl0', key: 'jp-t00-b-bl0-bl1', jrcType: 'g', scx: 0.37, scy: 0.9 },
//       { target: 't00-b-br1', key: 'jp-t00-b-br0-br1', jrcType: 'm', scx: 0.64, scy: 0.32 },
//       { target: 't00-b-bl1', key: 'jp-t00-b-bl0-bl1', jrcType: 'm', scx: 0.03, scy: 0.34 }
//     ],
//     top: 't00-b-b0', // top tCode to auto move
//     left: 't00-b-br1' // left tCode to auto move
//   }
// }
// type: device
// uCode/tCode/type/child num/child tCode,tCode,tCode ... list/calc jrc num
//          /target,key,jrcType,scx,scy/target,key ... list/top tCode/left tCode
function createPreStrSetTypeDevice(preSet) {
  let str = `${preSet.uCode}/${preSet.tCode}/${preSet.type}/${preSet.child.length}/`
  for (const cSet of preSet.child) {
    str += `${cSet.tCode},`
  }
  str = str.slice(0, str.length-1)
  str += `/${preSet.calcJrcInfo.list.length}`
  for (const jrc of preSet.calcJrcInfo.list) {
    str += `/${jrc.target},${jrc.key},${jrc.jrcType},${jrc.scx},${jrc.scy}`
  }
  str += `/${preSet.calcJrcInfo.top}/${preSet.calcJrcInfo.left}`
  return str
}

// const t00UnitSet = {
//   uCode: '',
//   tCode: 't00-unit',
//   type: 'device-group',
//   child: [
//     t00BSet, t00CSet
//   ],
//   calcJrcInfo: { // frame set, jrc order
//     list: [
//       // jrcType: m (move) / g (goal)
//       // scx, scy: scale x, scale y
//       { target: 't00-c', key: 'jp-t00-c-b', jrcType: 'g', scx: 0.5, scy: 0.9 },
//       { target: 't00-b', key: 'jp-t00-c-b', jrcType: 'm', scx: 0.1, scy: 0.1 }
//     ],
//     top: 't00-c', // top tCode to auto move
//     left: 't00-c' // left tCode to auto move
//   },
//   childInfo: { // calculate jrc list by childInfo
//     //   child target x, y / device w, h + margin
//     list: [
//       {
//         target: 't00-c',
//         key: 'jp-t00-c-b',
//         cTarget: 't00-c-b', // child tCode
//         margin: { // has: scx, scy + margin
//           scx: 0.01,
//           scy: 0.29
//         }
//       },
//       {
//         target: 't00-b',
//         key: 'jp-t00-c-b',
//         cTarget: 't00-b-b0', // child tCode
//         margin: { // has: scx, scy + margin
//           scx: 0.01,
//           scy: 0.01
//         }
//       }
//     ]
//   }
// }
// type: device-group
// uCode/tCode/type/child num/child tCode, tCode ... list/calc jrc num
//          /target,key,jrcType,scx,scy/target,key ... list/top tCode/left tCode
//          /child info num/target,key,cTarget,margin scx,margin scy/target, key ... list
function createPreStrSetTypeDeviceGroup(preSet) {
  let str = `${preSet.uCode}/${preSet.tCode}/${preSet.type}/${preSet.child.length}/`
  for (const cSet of preSet.child) {
    str += `${cSet.tCode},`
  }
  str = str.slice(0, str.length-1)
  str += `/${preSet.calcJrcInfo.list.length}`
  for (const jrc of preSet.calcJrcInfo.list) {
    str += `/${jrc.target},${jrc.key},${jrc.jrcType},${jrc.scx},${jrc.scy}`
  }
  str += `/${preSet.calcJrcInfo.top}/${preSet.calcJrcInfo.left}`
  if (preSet.childInfo) {
    str += `/${preSet.childInfo.list.length}`
    for (const ci of preSet.childInfo.list) {
      str += `/${ci.target},${ci.key},${ci.cTarget}`
      if (preSet.childInfo.margin) {
        str += `,${preSet.childInfo.margin.scx},${preSet.childInfo.margin.scy}`
      } else {
        str += ',0,0'
      }
    }
  }
  return str
}

// type: part
// uCode/tCode/type/lineUCode/jrc num/target,key,jrcType,scx,scy
//           /target,key, ... list /trans num/type,value,value/type,value ... list
function createPresetPart(strSet) {
  const strSetSplit = strSet.split('/')
  const uCode = strSetSplit[0]
  const tCode = strSetSplit[1]
  const type = strSetSplit[2]
  const lineUCode = strSetSplit[3]
  const jrcNum = Number(strSetSplit[4])
  const jrcStart = 5
  const jrcInfo = { list: [] }
  const jrcLengthI = jrcStart + jrcNum
  for (let i=jrcStart; i<jrcLengthI; i++) {
    const str = strSetSplit[i]
    const split = str.split(',')
    const target = split[0]
    const key = split[1]
    const jrcType = split[2]
    const scx = Number(split[3])
    const scy = Number(split[4])
    jrcInfo.list.push({ target: target, key: key, jrcType: jrcType, scx: scx, scy: scy })
  }
  const transNum = Number(strSetSplit[jrcLengthI])
  console.log(`transNum: ${transNum}`)
  let transInfo = null
  if (transNum > 0) {
    transInfo = {
      list: []
    }
    const transStart = jrcLengthI + 1
    for (let i=transStart; i<transStart+transNum; i++) {
      const str = strSetSplit[i]
      const split = str.split(',')
      const type = split[0]
      if (type === 'scale') transInfo.list.push({ type: type, scaleX: Number(split[1]), scaleY: Number(split[2])})
      if (type === 'rotate') transInfo.list.push({ type: type, degree: Number(split[1]) })
    }
  }
  return {
    uCode: uCode,
    tCode: tCode,
    type: type,
    lineUCode: lineUCode,
    jrcInfo: jrcInfo,
    transInfo: transInfo
  }
}

// type: device
// uCode/tCode/type/child num/child tCode,tCode,tCode ... list/calc jrc num
//          /target,key,jrcType,scx,scy/target,key ... list/top tCode/left tCode
function createPresetDevice(strSet, presetList) {
  const strSetSplit = strSet.split('/')
  const uCode = strSetSplit[0]
  const tCode = strSetSplit[1]
  const type = strSetSplit[2]
  const childNum = Number(strSetSplit[3])
  const childStr = strSetSplit[4]
  const childStrSplit = childStr.split(',')
  const child = []
  for (const tcd of childStrSplit) {
    const preset = presetList.find(p => p.tCode === tcd)
    child.push(preset)
  }
  const calcJrcNum = Number(strSetSplit[5])
  const calcJrcStart = 6
  const calcJrcLengthI = calcJrcStart + calcJrcNum
  const calcJrcInfo = { list: [], top: '', left: '' }
  for (let i=calcJrcStart; i<calcJrcLengthI; i++) {
    const str = strSetSplit[i]
    const split = str.split(',')
    const target = split[0]
    const key = split[1]
    const jrcType = split[2]
    const scx = Number(split[3])
    const scy = Number(split[4])
    calcJrcInfo.list.push({ target: target, key: key, jrcType: jrcType, scx: scx, scy: scy })
  }
  calcJrcInfo.top = strSetSplit[calcJrcLengthI]
  calcJrcInfo.left = strSetSplit[calcJrcLengthI + 1]

  return {
    uCode: uCode,
    tCode: tCode,
    type: type,
    child: child,
    calcJrcInfo: calcJrcInfo
  }
}

// type: device-group
// uCode/tCode/type/child num/child tCode, tCode ... list/calc jrc num
//          /target,key,jrcType,scx,scy/target,key ... list/top tCode/left tCode
//          /child info num/target,key,cTarget,margin scx,margin scy/target, key ... list
function createPresetDeviceGroup(strSet, presetList) {
  const strSetSplit = strSet.split('/')
  const uCode = strSetSplit[0]
  const tCode = strSetSplit[1]
  const type = strSetSplit[2]
  const childNum = Number(strSetSplit[3])
  const childStr = strSetSplit[4]
  const childStrSplit = childStr.split(',')
  const child = []
  for (const tcd of childStrSplit) {
    const preset = presetList.find(p => p.tCode === tcd)
    child.push(preset)
  }
  const calcJrcNum = Number(strSetSplit[5])
  const calcJrcStart = 6
  const calcJrcLengthI = calcJrcStart + calcJrcNum
  const calcJrcInfo = { list: [], top: '', left: '' }
  for (let i=calcJrcStart; i<calcJrcLengthI; i++) {
    const str = strSetSplit[i]
    const split = str.split(',')
    const target = split[0]
    const key = split[1]
    const jrcType = split[2]
    const scx = Number(split[3])
    const scy = Number(split[4])
    calcJrcInfo.list.push({ target: target, key: key, jrcType: jrcType, scx: scx, scy: scy })
  }
  calcJrcInfo.top = strSetSplit[calcJrcLengthI]
  calcJrcInfo.left = strSetSplit[calcJrcLengthI + 1]

  const childInfoNum = Number(strSetSplit[calcJrcLengthI + 2])
  let childInfo = null
  if (childInfoNum > 0) {
    childInfo = {
      list: []
    }
    const childInfoStart = calcJrcLengthI + 3
    const childInfoLengthI = childInfoStart + childInfoNum
    for (let i=childInfoStart; i<childInfoLengthI; i++) {
      const str = strSetSplit[i]
      const split = str.split(',')
      const target = split[0]
      const key = split[1]
      const cTarget = split[2]
      const marginScx = Number(split[3])
      const marginScy = Number(split[4])
      childInfo.list.push({ target: target, key: key, cTarget: cTarget, margin: { scx: marginScx, scy: marginScy }})
    }
  }

  return {
    uCode: uCode,
    tCode: tCode,
    type: type,
    child: child,
    calcJrcInfo: calcJrcInfo,
    childInfo: childInfo
  }
}
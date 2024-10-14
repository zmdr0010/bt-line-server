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
    console.log(`w: ${partInfo.w}, h: ${partInfo.h}, scx: ${cjInfo.scx}, scy: ${cjInfo.scy}, x: ${x}, y: ${y}`)
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
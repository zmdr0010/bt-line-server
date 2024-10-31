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

function changeToJrcInfo(calcJrcInfo) {
  const list = []
  for (const cjInfo of calcJrcInfo.list) {
    const x = cjInfo.x
    const y = cjInfo.y
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
      // console.log(`x: ${mPartInfo.x} = ${gPartInfo.x} + ${gJrcInfo.x} - ${jrcInfo.x}`)
      // console.log(`y: ${mPartInfo.y} = ${gPartInfo.y} + ${gJrcInfo.y} - ${jrcInfo.y}`)
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

function moveAutoJoin(partInfo, calcJrcInfo) {
  const jrcInfoList = changeToJrcInfo(calcJrcInfo)

  // 1. m to g
  moveByJrcInfo(partInfo.child, jrcInfoList)

  // 2. fit
  let minX = 10000000
  let minY = 10000000
  for (const c of partInfo.child) {
    minX = Math.min(minX, c.x)
    minY = Math.min(minY, c.y)
  }
  const my = 0 - minY
  const mx = 0 - minX
  for (const c of partInfo.child) {
    c.x += mx
    c.y += my
  }

  // 3. re calculate w, h
  partInfo.w = 0
  partInfo.h = 0
  calculatePartSize(partInfo)
}

// info: dvcSrtInfo
// {
//     uCode: `dvc-srt-${type}-${getCurrentDateUCode()}`,
//     tCode: tCode,
//     type: type, // device / part
//     lineUCode: '',
//     jrcInfo: null, // has -> override parent calcJrcInfo
//     transInfo: null, // in device -> apply to child
//     calcJrcInfo: null, // device
//     child: [] // device: device has part or device
//  }
function createDvcPart(info, lineSetList) {
  const part = {
    uCode: `part-${info.tCode}-${getCurrentDateUCode()}`,
    w: 100,
    h: 100,
    x: 0,
    y: 0,
    tCode: info.tCode,
    lineInfo: null,
    child: []
  }

  if (info.lineUCode.length > 0) {
    const lineSet = lineSetList.find(s => s.split('/')[0] === info.lineUCode)
    if (lineSet) {
      const line = createSimpleLineInfo(lineSet)
      part.lineInfo = createLinePointFromLineInfo(line)
    }
  }
  if (info.transInfo) {
    for (const tr of info.transInfo.list) {
      if (tr.type === 'fit') {
        if (part.lineInfo) {
          const scx = tr.w / part.lineInfo.w
          const scy = tr.h / part.lineInfo.h
          part.lineInfo = createScaledLineInfo(part.lineInfo, scx, scy)
          part.lineInfo = createLinePointFromLineInfo(part.lineInfo)
        }
      }
      if (tr.type === 'scale') {
        if (part.lineInfo) {
          part.lineInfo = createScaledLineInfo(part.lineInfo, tr.scaleX, tr.scaleY)
          part.lineInfo = createLinePointFromLineInfo(part.lineInfo)
        }
      }
      if (tr.type === 'rotate') {
        if (part.lineInfo) {
          part.lineInfo = createRotateLineInfo(part.lineInfo, degreeToRadian(tr.degree))
          fitSimpleLineInfo(part.lineInfo)
          part.lineInfo = createLinePointFromLineInfo(part.lineInfo)
        }
      }
      if (tr.type === 'sftRI') {
        if (part.lineInfo) {
          part.lineInfo = createShiftRotateILineInfo(part.lineInfo, tr.ri)
          part.lineInfo = createLinePointFromLineInfo(part.lineInfo)
        }
      }
      if (tr.type === 'p4') {
        if (part.lineInfo) {
          const pList = transformPoints4(part.lineInfo.pointInfo.list, part.lineInfo.w, part.lineInfo.h, tr.p4Info)
          for (let i=0; i<pList.length; i++) {
            const p = pList[i]
            const pp = part.lineInfo.pointInfo.list[i]
            pp.x = p.x
            pp.y = p.y
          }
          fitSimpleLineInfo(part.lineInfo)
        }
      }
    }
  }
  if (part.lineInfo) {
    part.w = part.lineInfo.w
    part.h = part.lineInfo.h
  }

  let calcJrc
  if (info.calcJrcInfo) calcJrc = structuredClone(info.calcJrcInfo)

  for (const c of info.child) {
    part.child.push(createDvcPart(c, lineSetList))

    if (calcJrc && c.jrcInfo) {
      for (const cj of c.jrcInfo.list) {
        const clcJ = calcJrc.list.find(j => j.key === cj.key && j.target === cj.target)
        clcJ.x = cj.x
        clcJ.y = cj.y
      }
    }
  }

  if (calcJrc) moveAutoJoin(part, calcJrc)

  return part
}
function createDvcSrtInfoListByTCodeSet(setList) {
  const result = []
  for (const set of setList) result.push(createDvcSrtInfoByTCodeSet(set, result))

  // set jrcInfo
  for (const info of result) {
    if (info.type === 'part' || !info.calcJrcInfo) continue
    for (const c of info.child) {
      c.jrcInfo = { list: [] }
      for (const cJrc of info.calcJrcInfo.list) {
        if (c.tCode !== cJrc.target) continue
        c.jrcInfo.list.push({ target: cJrc.target, key: cJrc.key, jrcType: cJrc.jrcType, x: 0, y: 0 })
      }
    }
  }

  return result
}

function createDvcSrtInfoListByTCodeBundleSet(set) {
  const split = set.split('\n')
  const uCode = split[0]
  const type = split[1]
  const stList = split.slice(2, split.length)
  const result = createDvcSrtInfoListByTCodeSet(stList)
  result.sort((a, b) => Number(a.type < b.type))
  return result
}

// dvc: device, srt: structure
function createDvcSrtInfoByTCodeSet(set, infoList) {
  const split = set.split('/')
  const tCode = split[0]
  const result = createEmptyDvcSrtInfo(tCode, 'device')
  if (split.length < 3) {
    result.type = 'part'
    return result
  }
  const childNum = Number(split[1])
  const cStr = split[2]
  const cStrSplit = cStr.split(',')
  for (const t of cStrSplit) {
    let c = infoList.find(info => info.tCode === t)
    if (!c) {
      c = createEmptyDvcSrtInfo(t, 'part')
      infoList.push(c)
    }
    result.child.push(c)
  }
  const keyNum = Number(split[3])
  if (keyNum > 0) {
    const keyStr = split[4]
    const keyStrSplit = keyStr.split(',')
    result.calcJrcInfo = { list: [] }
    for (const key of keyStrSplit) {
      const keySplit = key.split('_')
      const g = keySplit[0]
      const m = keySplit[1]
      result.calcJrcInfo.list.push({ target: g, key: key, jrcType: 'g', x: 0, y: 0 })
      result.calcJrcInfo.list.push({ target: m, key: key, jrcType: 'm', x: 0, y: 0 })
    }
  }
  return result
}

function createEmptyDvcSrtInfo(tCode, type) {
  return {
    uCode: `dvc-srt-${type}-${getCurrentDateUCode()}`,
    tCode: tCode,
    type: type, // device / part
    lineUCode: '',
    jrcInfo: null, // has -> override parent calcJrcInfo
    transInfo: null, // in device -> apply to child
    calcJrcInfo: null, // device
    child: [] // device: device has part or device
  }
}

// strSet
// uCode/tCode/type/lineUCode/child num/child tCode,tCode ... list
//       /calcJrc num/target,key,jrcType,x,y/target,key,jrcType, ... list
//       /jrc num/target,key,jrcType,x,y/target,key,jrcType, ... list
//       /trans num/type,value,value/type,value/ ... list
function createDvcSrtStrSet(info) {
  let result =  `${info.uCode}/${info.tCode}/${info.type}/${info.lineUCode}/${info.child.length}/`
  for (let i=0; i<info.child.length; i++) {
    const c = info.child[i]
    if (i === info.child.length - 1) {
      result += `${c.tCode}`
    } else {
      result += `${c.tCode},`
    }
  }
  if (info.calcJrcInfo) {
    const calcJrcNum = info.calcJrcInfo.list.length
    result += `/${calcJrcNum}`
    for (const cJrc of info.calcJrcInfo.list) {
      result += `/${cJrc.target},${cJrc.key},${cJrc.jrcType},${cJrc.x},${cJrc.y}`
    }
  } else {
    result += `/0`
  }

  if (info.jrcInfo) {
    const jrcNum = info.jrcInfo.list.length
    result += `/${jrcNum}`
    for (const jrc of info.jrcInfo.list) {
      result += `/${jrc.target},${jrc.key},${jrc.jrcType},${jrc.x},${jrc.y}`
    }
  } else {
    result += '/0'
  }

  let transNum = 0
  if (info.transInfo) transNum = info.transInfo.list.length
  result += `/${transNum}`
  for (let i=0; i<transNum; i++) {
    const trans = info.transInfo.list[i]
    if (trans.type === 'fit') result += `/${trans.type},${trans.w},${trans.h}`
    if (trans.type === 'scale') result += `/${trans.type},${trans.scaleX},${trans.scaleY}`
    if (trans.type === 'rotate') result += `/${trans.type},${trans.degree}`
    if (trans.type === 'sftRI') result += `/${trans.type},${trans.ri}`
    if (trans.type === 'p4') result += `/${trans.type},${trans.p4Info.lt.scx},${trans.p4Info.lt.scy},${trans.p4Info.rt.scx},${trans.p4Info.rt.scy},${trans.p4Info.lb.scx},${trans.p4Info.lb.scy},${trans.p4Info.rb.scx},${trans.p4Info.rb.scy}`
  }
  return result
}

function createDvcSrtInfoList(setList) {
  const result = []
  for (const set of setList) result.push(createDvcSrtInfo(set, result))
  return result
}

// strSet
// uCode/tCode/type/lineUCode/child num/child tCode,tCode ... list
//       /calcJrc num/target,key,jrcType,x,y/target,key,jrcType, ... list
//       /jrc num/target,key,jrcType,x,y/target,key,jrcType, ... list
//       /trans num/type,value,value/type,value/ ... list
function createDvcSrtInfo(set, infoList) {
  const split = set.split('/')
  const uCode = split[0]
  const tCode = split[1]
  const type = split[2]
  const result = createEmptyDvcSrtInfo(tCode, type)
  result.uCode = uCode
  result.lineUCode = split[3]
  const childNum = Number(split[4])
  const childStr = split[5]
  if (childNum > 0) {
    const cSplit = childStr.split(',')
    for (const tCode of cSplit) {
      const c = infoList.find(info => info.tCode === tCode)
      if (c) result.child.push(c)
    }
  }
  const calcJrcNum = Number(split[6])
  let next = 7
  if (calcJrcNum > 0) {
    result.calcJrcInfo = { list: [] }
    const start = next
    next += calcJrcNum
    for (let i=start; i<next; i++) {
      const cJrcStr = split[i]
      const cJrcSplit = cJrcStr.split(',')
      result.calcJrcInfo.list.push({
        target: cJrcSplit[0], key: cJrcSplit[1], jrcType: cJrcSplit[2], x: Number(cJrcSplit[3]), y: Number(cJrcSplit[4])
      })
    }
  }
  const jrcNum = Number(split[next])
  next++
  if (jrcNum > 0) {
    result.jrcInfo = { list: [] }
    const start = next
    next += jrcNum
    for (let i=start; i<next; i++) {
      const jrcStr = split[i]
      const jrcSplit = jrcStr.split(',')
      result.jrcInfo.list.push({
        target: jrcSplit[0], key: jrcSplit[1], jrcType: jrcSplit[2], x: Number(jrcSplit[3]), y: Number(jrcSplit[4])
      })
    }
  }
  const transNum = Number(split[next])
  next++
  if (transNum > 0) {
    result.transInfo = { list: [] }
    const start = next
    next += transNum
    for (let i=start; i<next; i++) {
      const trnStr = split[i]
      const trnSplit = trnStr.split(',')
      if (trnSplit[0] === 'fit') result.transInfo.list.push({
        type: trnSplit[0], w: Number(trnSplit[1]), h: Number(trnSplit[2])
      })
      if (trnSplit[0] === 'scale') result.transInfo.list.push({
        type: trnSplit[0], scaleX: Number(trnSplit[1]), scaleY: Number(trnSplit[2])
      })
      if (trnSplit[0] === 'rotate') result.transInfo.list.push({
        type: trnSplit[0], degree: Number(trnSplit[1])
      })
      if (trnSplit[0] === 'sftRI') result.transInfo.list.push({
        type: trnSplit[0], ri: Number(trnSplit[1])
      })
      if (trnSplit[0] === 'p4') result.transInfo.list.push({
        type: trnSplit[0], p4Info: {
          lt: { scx: Number(trnSplit[1]), scy: Number(trnSplit[2]) },
          rt: { scx: Number(trnSplit[3]), scy: Number(trnSplit[4]) },
          lb: { scx: Number(trnSplit[5]), scy: Number(trnSplit[6]) },
          rb: { scx: Number(trnSplit[7]), scy: Number(trnSplit[8]) }
        }
      })
    }
  }
  return result
}

// bundle
// uCode
// strSet (part)
// strSet
// ...
// strSet (device)
// ...
// strSet (unit device)
function createDvcSrtBundleStrSet(infoList) {
  const uCode = `dvc-srt-bundle-${getCurrentDateUCode()}`
  const type = 'edit'
  let result = `${uCode}\n${type}`
  for (const info of infoList) {
    result += `\n${createDvcSrtStrSet(info)}`
  }
  return { uCode: uCode, bundleSet: result }
}

function createDvcSrtBundleInfo(set) {
  const split = set.split('\n')
  const uCode = split[0]
  const type = split[1]
  const stList = split.slice(2, split.length)
  const list = createDvcSrtInfoList(stList)
  return { uCode: uCode, list: list }
}

function createDvcSrtTCodeBundleStrSet(setList) {
  return `dvc-srt-tcode-bundle-${getCurrentDateUCode()}\ntCode\n${setList.join('\n')}`
}
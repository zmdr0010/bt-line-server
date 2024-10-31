function createOutPInfoList(pList, szw, szh) {
  const iPList = []
  for (let i=0; i<pList.length-1; i++) {
    const p = pList[i]
    iPList.push({ i:i, x: p.x, y: p.y,
      left: null, right: null, top: null, bottom: null,
      order: [], dir: []})
  }
  for (const p of iPList) {
    p.left = iPList.find(pt => p.x - szw === pt.x && p.y === pt.y)
    p.right = iPList.find(pt => p.x + szw === pt.x && p.y === pt.y)
    p.top = iPList.find(pt => p.y - szh === pt.y && p.x === pt.x)
    p.bottom = iPList.find(pt => p.y + szh === pt.y && p.x === pt.x)
    const left = p.left
    const right = p.right
    const top = p.top
    const bottom = p.bottom
    let prev = p.i - 1
    let next = p.i + 1
    if (prev < 0) prev = iPList.length - 1
    if (next > iPList.length - 1) next = 0
    const prevP = iPList[prev]
    const nextP = iPList[next]
    const order = []
    const dir = [0, 0]
    if (left && prevP === left) setOrderDir('left', order, dir)
    if (right && prevP === right) setOrderDir('right', order, dir)
    if (top && prevP === top) setOrderDir('top', order, dir)
    if (bottom && prevP === bottom) setOrderDir('bottom', order, dir)
    if (left && nextP === left) setOrderDir('left', order, dir)
    if (right && nextP === right) setOrderDir('right', order, dir)
    if (top && nextP === top) setOrderDir('top', order, dir)
    if (bottom && nextP === bottom) setOrderDir('bottom', order, dir)
    p.order = order
    p.dir = dir
  }
  return iPList
}

function setOrderDir(type, order, dir) {
  switch (type) {
    case 'left':
      order.push('left')
      dir[0] = -1
      break
    case 'right':
      order.push('right')
      dir[0] = 1
      break
    case 'top':
      order.push('top')
      dir[1] = -1
      break
    case 'bottom':
      order.push('bottom')
      dir[1] = 1
      break
  }
}

function editOutPInfoList(pList, szw, szh, iList, editType='remove-p') {
  const oPList = createOutPInfoList(pList, szw, szh)
  const list = []
  for (const p of oPList) {
    const rp = { x: p.x, y: p.y }
    // const addPList = []
    // let isAdding = false
    // for (const i of iList) if (i === p.i) isAdding = true
    // if (isAdding) {
    //   if (editType === 'remove-p') {
    //     let addP0
    //     let addP1
    //     if (p.order[0] === 'left') addP0 = { x: p.left.x, y: p.left.y }
    //     if (p.order[0] === 'right') addP0 = { x: p.right.x, y: p.right.y }
    //     if (p.order[0] === 'top') addP0 = { x: p.top.x, y: p.top.y }
    //     if (p.order[0] === 'bottom') addP0 = { x: p.bottom.x, y: p.bottom.y }
    //     if (p.order[1] === 'left') addP1 = { x: p.left.x, y: p.left.y }
    //     if (p.order[1] === 'right') addP1 = { x: p.right.x, y: p.right.y }
    //     if (p.order[1] === 'top') addP1 = { x: p.top.x, y: p.top.y }
    //     if (p.order[1] === 'bottom') addP1 = { x: p.bottom.x, y: p.bottom.y }
    //     if (addP0) addPList.push(addP0)
    //     if (addP1) addPList.push(addP1)
    //   }
    // }
    //
    // if (addPList.length > 0) {
    //   for (const ap of addPList) list.push(ap)
    // } else {
    //   list.push(rp)
    // }
    let isEditing = false
    for (const i of iList) if (i === p.i) isEditing = true
    if (isEditing) {
      if (editType === 'remove-p') {
        // not push
      }
    } else {
      list.push(rp)
    }
  }
  const first = list[0]
  list.push({ x: first.x, y: first.y })
  return list
}

// pI0, pI1: pList[pI0] -> p0, [pI1] -> p1 (line): remove p in p0-p1
// editInfo: { type: '', ... ect values by type }
function changeLineInPList(pList, pI0, pI1, editInfo) {
  const opList = pList.slice(0, pList.length-1)
  let list = []

  const p0 = opList[pI0]
  const p1 = opList[pI1]
  // list.push({ x: p0.x, y: p0.y })
  // list.push({ x: p1.x, y: p1.y })
  if (pI0 < pI1) {
    let i = 0
    for (const p of opList) {
      if (i >= pI0 && i <= pI1) {
        if (i === pI0) {
          list.push({ x: p0.x, y: p0.y })
        } else if (i === pI1) {
          list.push({ x: p1.x, y: p1.y })
        } else {
          // if (editInfo.type === 'slice') {
          //
          // }
          if (editInfo.type === 'curve') {
            const curves = createPListCurve(p0, p1, editInfo.cp, editInfo.interval)
            list = list.concat(curves.slice(1, curves.length-2))
          }
        }
      } else {
        list.push({ x: p.x, y: p.y })
      }
      i++
    }
  } else { // ex. length 10: 8,9,0,1,2
    for (let i=pI1; i<=pI0; i++) {
      const p = opList[i]
      list.push({ x: p.x, y: p.y })
    }
    if (editInfo.type === 'curve') {
      const curves = createPListCurve(p0, p1, editInfo.cp, editInfo.interval)
      list = list.concat(curves.slice(1, curves.length-2))
    }
  }

  const first = list[0]
  list.push({ x: first.x, y: first.y })
  return list
}
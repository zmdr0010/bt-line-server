// check p.i
// has p -> i-1: left, i+1: bottom -> rightTop
// has p -> i-1: bottom, i+1: left -> inside rightTop
// has p -> i-1: top, i+1: left -> right bottom
// has p -> i-1: left, i+1: top -> inside right bottom
// has p -> i-1: bottom, i+1: right -> leftTop
// has p -> i-1: right, i+1: bottom -> inside leftTop
// has p -> i-1: right, i+1: top -> leftBottom
// has p -> i-1: top, i+1: right -> inside leftBottom
// start is always leftTop
// in list: start(0) = last(length-1), list.pop -> edit -> last set by first and push
// start(0) - 1: length-1(last-1), length-1(last-1) + 1: start(0)
function editPListEdgeInOutSide(pList, szw, szh, type='inout', editType='add-p', target={iList:[], list:[]}) {
  const iPList = createIPList(pList, szw, szh)
  const list = []
  for (const p of iPList) {
    const rp = { x: p.x, y: p.y }
    const addPList = []
    const mx = szw * 0.5
    const my = szh * 0.5
    const mmx = mx * 0.5 * 0.5
    const mmy = my * 0.5 * 0.5
    const interval = 1
    const edgeType = checkOutlineEdge(p, iPList)
    const dirInfo = checkEdgeDir(edgeType)
    let isAdding = false
    if (type === 'target') {
      for (const ti of target.iList) if (ti === p.i) isAdding = true
      for (const et of target.list) if (edgeType === et) isAdding = true
    } else {
      if (type === 'inout' || type === 'out') {
        if (edgeType === 'right-top' || edgeType === 'right-bottom'
          || edgeType === 'left-top' || edgeType === 'left-bottom') {
          isAdding = true
        }
      }
      if (type === 'input' || type === 'in') {
        if (edgeType === 'right-top-inside' || edgeType === 'right-bottom-inside'
          || edgeType === 'left-top-inside' || edgeType === 'left-bottom-inside') {
          isAdding = true
        }
      }
    }

    if (isAdding) {
      if (editType === 'add-p') {
        const addP0 = { x: p.x, y: p.y }
        const addP1 = { x: p.x, y: p.y }
        if (dirInfo.order[0] === 'left' || dirInfo.order[0] === 'right') addP0.x += mx * dirInfo.dir[0]
        if (dirInfo.order[0] === 'top' || dirInfo.order[0] === 'bottom') addP0.y += my * dirInfo.dir[1]
        if (dirInfo.order[1] === 'left' || dirInfo.order[1] === 'right') addP1.x += mx * dirInfo.dir[0]
        if (dirInfo.order[1] === 'top' || dirInfo.order[1] === 'bottom') addP1.y += my * dirInfo.dir[1]
        rp.x += mmx * dirInfo.dir[0]
        rp.y += mmy * dirInfo.dir[1]
        addPList.push(addP0)
        addPList.push(rp)
        addPList.push(addP1)
      }
      if (editType === 'slice') {
        rp.x += mx * dirInfo.dir[0]
        rp.y += my * dirInfo.dir[1]
        addPList.push(rp)
      }
      if (editType === 'curve') {
        let p0
        let p1
        if (dirInfo.order[0] === 'left') p0 = p.left
        if (dirInfo.order[0] === 'right') p0 = p.right
        if (dirInfo.order[0] === 'top') p0 = p.top
        if (dirInfo.order[0] === 'bottom') p0 = p.bottom
        if (dirInfo.order[1] === 'left') p1 = p.left
        if (dirInfo.order[1] === 'right') p1 = p.right
        if (dirInfo.order[1] === 'top') p1 = p.top
        if (dirInfo.order[1] === 'bottom') p1 = p.bottom
        if (p0 && p1) {
          const list = createPListCurve(p0, p1, rp, interval)
          for (let i=1; i<list.length-1; i++) addPList.push({ x: list[i].x, y: list[i].y })
        }
      }
    }

    if (addPList.length > 0) {
      for (const ap of addPList) list.push(ap)
    } else {
      list.push(rp)
    }
  }
  const first = list[0]
  list.push({ x: first.x, y: first.y })
  return list
}

function createIPList(pList, szw, szh) {
  const iPList = []
  for (let i=0; i<pList.length-1; i++) {
    const p = pList[i]
    iPList.push({ i:i, x: p.x, y: p.y, left: null, right: null, top: null, bottom: null})
  }
  for (const p of iPList) {
    p.left = iPList.find(pt => p.x - szw === pt.x && p.y === pt.y)
    p.right = iPList.find(pt => p.x + szw === pt.x && p.y === pt.y)
    p.top = iPList.find(pt => p.y - szh === pt.y && p.x === pt.x)
    p.bottom = iPList.find(pt => p.y + szh === pt.y && p.x === pt.x)
  }
  return iPList
}

function checkOutlineEdge(p, iPList) {
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
  if (left && bottom && prevP.i === left.i && nextP.i === bottom.i) return 'right-top'
  if (top && left && prevP.i === top.i && nextP.i === left.i) return 'right-bottom'
  if (bottom && right && prevP.i === bottom.i && nextP.i === right.i) return 'left-top'
  if (right && top && prevP.i === right.i && nextP.i === top.i) return 'left-bottom'
  if (bottom && left && prevP.i === bottom.i && nextP.i === left.i) return 'right-top-inside'
  if (left && top && prevP.i === left.i && nextP.i === top.i) return 'right-bottom-inside'
  if (right && bottom && prevP.i === right.i && nextP.i === bottom.i) return 'left-top-inside'
  if (top && right && prevP.i === top.i && nextP.i === right.i) return 'left-bottom-inside'
  return 'normal'
}

// right-top: left, bottom -> [-1, 1]
// right-bottom: top, left (left, top) -> [-1, -1]
// left-top: bottom, right (right, bottom) -> [1, 1]
// left-bottom: right, top -> [1, -1]
// right-top-inside: bottom, left (left, bottom) -> [-1, 1]
// right-bottom-inside: left, top -> [-1, -1]
// left-top-inside: right, bottom -> [1, 1]
// left-bottom-inside: top, right (right, top) -> [1, -1]
function checkEdgeDir(edgeType) {
  switch (edgeType) {
    case 'right-top':
      return { dir: [-1, 1], order: ['left', 'bottom'] }
    case 'right-top-inside':
      return { dir: [-1, 1], order: ['bottom', 'left'] }
    case 'right-bottom':
      return { dir: [-1, -1], order: ['top', 'left'] }
    case 'right-bottom-inside':
      return { dir: [-1, -1], order: ['left', 'top'] }
    case 'left-top':
      return { dir: [1, 1], order: ['bottom', 'right'] }
    case 'left-top-inside':
      return { dir: [1, 1], order: ['right', 'bottom'] }
    case 'left-bottom':
      return { dir: [1, -1], order: ['right', 'top'] }
    case 'left-bottom-inside':
      return { dir: [1, -1], order: ['top', 'right'] }
    default: return { dir: [0, 0], order: [] }
  }
}
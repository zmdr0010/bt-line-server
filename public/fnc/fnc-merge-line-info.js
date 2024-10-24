// list: [ spLineInfo, spLineInfo ]
function mergeSpLineInfo(uCode, list) {
  const mrgLineInfo = {
    uCode: uCode,
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    list: [],
    child: []
  }
  for (const info of list) {
    const sx = info.x
    const sy = info.y
    console.log(`sx: ${sx}, sy: ${sy}`)
    for (const dw of info.list) {
      const width = dw.width
      const color = dw.color
      const pList = []
      for (const p of dw.list) pList.push({ x: p.x + sx, y: p.y + sy})
      mrgLineInfo.list.push({ width: width, color: color, list: pList })
    }
  }
  calculateLineInfoSize(mrgLineInfo)
  return mrgLineInfo
}

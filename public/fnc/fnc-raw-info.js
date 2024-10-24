// uCode/column/row/rawNum/rw rw rw  ... list
function createRawInfo(set) {
  const split = set.split('/')
  const uCode = split[0]
  const column = Number(split[1])
  const row = Number(split[2])
  const rawNum = Number(split[3])
  const rawStr = split[4]
  const rawSplit = rawStr.split('')
  const raw = []
  for (const str of rawSplit) raw.push(Number(str))
  return {
    uCode: uCode,
    row: row,
    column: column,
    raw: raw,
    rawNum: rawNum
  }
}

function createRawStrSet(info) {
  return `${info.uCode}/${info.column}/${info.row}/${info.rawNum}/${info.raw.join('')}`
}

function fitRawInfo(info) {
  let minC = 100000
  let maxC = 0
  let minR = 100000
  let maxR = 0
  const column = info.column
  const length = info.raw.length
  const raw = []
  for (let i=0; i<length; i++) {
    const rw = info.raw[i]
    if (rw === 1) {
      const c = i % column
      const r = Math.floor(i / column)
      minC = Math.min(minC, c)
      maxC = Math.max(maxC, c)
      minR = Math.min(minR, r)
      maxR = Math.max(maxR, r)
    }
  }
  const rColumn = maxC - minC + 1
  const rRow = maxR - minR + 1
  for (let i=minR; i<=maxR; i++) {
    for (let j=minC; j<=maxC; j++) {
      raw.push(info.raw[i * column + j])
    }
  }
  return {
    uCode: `raw-${getCurrentDateUCode()}`,
    column: rColumn,
    row: rRow,
    rawNum: rColumn * rRow,
    raw: raw
  }
}

// uCode/num/rawSet uCode,x,y,szw,szh/rawSet uCode,x,y,szw,szh/ ... list
function createPlaceRawInfo(set) {
  const split = set.split('/')
  const uCode = split[0]
  const num = Number(split[1])
  const list = []
  for (let i=2; i<split.length; i++) {
    const str = split[i]
    const strSplit = str.split(',')
    const rawUCode = strSplit[0]
    const x = Number(strSplit[1])
    const y = Number(strSplit[2])
    const szw = Number(strSplit[3])
    const szh = Number(strSplit[4])
    list.push({
      uCode: rawUCode,
      x: x,
      y: y,
      szw: szw,
      szh: szh
    })
  }
  return {
    uCode: uCode,
    list: list
  }
}
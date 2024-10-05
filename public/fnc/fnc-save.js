function getCurrentDateUCode() {
  return getDateUCode(new Date())
}

function getDateUCode(date) {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const h = date.getHours()
  const mm = date.getMinutes()
  const s = date.getSeconds()
  return `${y}${getZeroStr(m)}${getZeroStr(d)}${getZeroStr(h)}${getZeroStr(mm)}${getZeroStr(s)}`
}

function getZeroStr(n) {
  return (n > 9) ? `${n}` : `0${n}`
}

function saveString(fileName, str) {
  const link = document.createElement('a')
  const file = new Blob([str], {type:'text/plain'})
  link.href = URL.createObjectURL(file)
  link.download = `${fileName}.txt`
  link.click()
  URL.revokeObjectURL(link.href)
}
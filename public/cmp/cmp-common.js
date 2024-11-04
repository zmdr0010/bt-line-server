function clearInput(id) {
  const input = document.getElementById(id)
  input.value = ''
}

function createBorderDiv() {
  const div = document.createElement('div')
  div.style.border = 'solid 1px'
  div.style.margin = '10px'
  return div
}

function createContentDiv() {
  const div = document.createElement('div')
  div.style.margin = '10px'
  return div
}

function createSubDiv() {
  const div = document.createElement('div')
  div.style.margin = '10px'
  return div
}

function createContainer() {
  const borderDiv = createBorderDiv()
  const contentDiv = createContentDiv()
  borderDiv.appendChild(contentDiv)
  return {
    border: borderDiv,
    content: contentDiv
  }
}

function createLineDiv(h=1, color='black') {
  const div = document.createElement('div')
  div.style.height = `${h}px`
  div.style.backgroundColor = color
  return div
}

function setDisabled(id, disabled) {
  const elm = document.getElementById(id)
  elm.disabled = disabled
}

function getDisabled(id) {
  const elm = document.getElementById(id)
  return elm.disabled
}

function setChecked(id, checked) {
  const elm = document.getElementById(id)
  elm.checked = checked
}

function getChecked(id) {
  const elm = document.getElementById(id)
  return elm.checked
}

function makeSimpleTxtDiv(id ,container, txt) {
  const div = createSubDiv()
  div.id = id
  div.innerText = txt
  container.appendChild(div)
}

function changeSimpleTxtDiv(id, txt) {
  const elm = document.getElementById(id)
  elm.innerText = txt
}
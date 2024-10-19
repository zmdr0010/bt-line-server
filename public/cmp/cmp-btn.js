// list: [ { id: '', labelTxt: '', onClick: null } ]
function makeBtnGroup(container, list) {
  const div = createSubDiv()
  container.appendChild(div)
  for (const info of list) div.appendChild(createBtn(info.id, info.labelTxt, info.onClick))
}

function createBtn(id, labelTxt, onClick) {
  const btn = document.createElement('button')
  btn.id = id
  btn.innerText = labelTxt
  btn.onclick = onClick
  btn.style.margin = '2px'
  return btn
}
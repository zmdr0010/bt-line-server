function makeSelect(id, container, labelTxt, firstTxt, onChange) {
  const div = createSubDiv()
  div.innerText = labelTxt
  const select = document.createElement('select')
  const option = document.createElement('option')
  option.innerText = firstTxt
  select.appendChild(option)
  select.id = id
  select.onchange = onChange
  div.appendChild(select)
  container.appendChild(div)
}

function initSelect(id, list) {
  const select = document.getElementById(id)
  select.innerHTML = ''
  for (const str of list) {
    const option = document.createElement('option')
    option.value = str
    option.innerText = str
    select.appendChild(option)
  }
}
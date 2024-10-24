function makeInputTextBtn(id, container, labelTxt, btnName, onClick) {
  const div = createSubDiv()
  const input = document.createElement('input')
  input.type = 'text'
  input.id = id
  input.style.margin = '2px'
  const clearBtn = document.createElement('button')
  clearBtn.style.margin = '2px'
  clearBtn.innerText = 'X'
  clearBtn.onclick = () => clearInput(id)
  const actBtn = document.createElement('button')
  actBtn.style.margin = '2px'
  actBtn.innerText = btnName
  actBtn.onclick = onClick
  div.innerText = `${labelTxt}`
  div.appendChild(input)
  div.appendChild(clearBtn)
  div.appendChild(actBtn)
  container.appendChild(div)
}

function makeInputNumBtn(id, container, labelTxt, btnName, onClick, value, step='1') {
  const div = createSubDiv()
  const input = document.createElement('input')
  input.type = 'number'
  input.id = id
  input.style.margin = '2px'
  input.value = value
  input.step = step
  const actBtn = document.createElement('button')
  actBtn.style.margin = '2px'
  actBtn.innerText = btnName
  actBtn.onclick = onClick
  div.innerText = `${labelTxt}`
  div.appendChild(input)
  div.appendChild(actBtn)
  container.appendChild(div)
}

function makeInputNum(id, container, labelTxt, value, onChange, step='1') {
  const div = createSubDiv()
  const input = document.createElement('input')
  input.type = 'number'
  input.id = id
  input.style.margin = '2px'
  input.value = value
  input.step = step
  input.onchange = onChange
  div.innerText = `${labelTxt}`
  div.appendChild(input)
  container.appendChild(div)
}

function makeInputText(id, container, labelTxt, onChange=null) {
  const div = createSubDiv()
  const input = document.createElement('input')
  input.type = 'text'
  input.id = id
  input.style.margin = '2px'
  input.onchange = onChange
  const clearBtn = document.createElement('button')
  clearBtn.style.margin = '2px'
  clearBtn.innerText = 'X'
  clearBtn.onclick = () => clearInput(id)
  div.innerText = `${labelTxt}`
  div.appendChild(input)
  div.appendChild(clearBtn)
  container.appendChild(div)
}

// one file
function makeInputFile(id, container, labelTxt, accept, onLoad) {
  const div = createSubDiv()
  div.innerText = labelTxt
  const input = document.createElement('input')
  input.type = 'file'
  input.id = id
  input.style.margin = '2px'
  input.accept = accept
  input.onchange = () => {
    const [file] = input.files
    const reader = new FileReader()
    reader.onload = () => {
      onLoad(reader.result)
    }
    if (file) {
      reader.readAsText(file)
    } else {
      onLoad('fail')
    }
  }
  div.appendChild(input)
  container.appendChild(div)
}

function makeInputFileTxt(id, container, labelTxt, onLoad) {
  makeInputFile(id, container, labelTxt, '.txt', onLoad)
}

function getInputValue(id) {
  const input = document.getElementById(id)
  return input.value
}

function getInputValueNumber(id) {
  const input = document.getElementById(id)
  return Number(input.value)
}

function changeInputValue(id, value) {
  const input = document.getElementById(id)
  input.value = value
}

// list: [ { id: '', labelTxt: '', onChange: null, value: 0, step: 1 } ]
function makeInputBoxOnOff(container, checkId, labelTxt, list, onCheck) {
  const div = createSubDiv()
  div.innerText = labelTxt
  const checkBox = document.createElement('input')
  checkBox.id = checkId
  checkBox.type = 'checkbox'
  checkBox.style.margin = '4px'
  checkBox.onchange = () => {
    for (const info of list) setDisabled(info.id, !checkBox.checked)
    onCheck()
  }
  div.appendChild(checkBox)
  container.appendChild(div)

  for (const info of list) {
    makeInputNum(info.id, div, info.labelTxt, info.value, info.onChange, info.step)
    setDisabled(info.id, true)
  }
}

function makeInputCheckBox(container, id, labelTxt, checked, onCheck) {
  const div = createSubDiv()
  div.innerText = labelTxt
  const checkBox = document.createElement('input')
  checkBox.id = id
  checkBox.type = 'checkbox'
  checkBox.style.margin = '4px'
  checkBox.checked = checked
  checkBox.onchange = onCheck
  div.appendChild(checkBox)
  container.appendChild(div)
}
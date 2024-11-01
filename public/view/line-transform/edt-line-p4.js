function createEdtLineP4(pnt, onChange, i=0) {
  const idCheckboxP4IsDrawing = `id-checkbox-p4-is-drawing-${i}`
  const idCheckboxP4IsOn = `id-checkbox-p4-is-on-${i}`
  const idInputP4LtX = `id-input-p4-lt-x-${i}`
  const idInputP4LtY = `id-input-p4-lt-y-${i}`
  const idInputP4RtX = `id-input-p4-rt-x-${i}`
  const idInputP4RtY = `id-input-p4-rt-y-${i}`
  const idInputP4LbX = `id-input-p4-lb-x-${i}`
  const idInputP4LbY = `id-input-p4-lb-y-${i}`
  const idInputP4RbX = `id-input-p4-rb-x-${i}`
  const idInputP4RbY = `id-input-p4-rb-y-${i}`
  const idBtnCalcP4 = `id-btn-calc-p4-${i}`
  const edt = {
    eInfo: null,
    isDrawingP4: false,
    draw: () => {},
    calculateP4: () => {},
    updateP4Edit: () => {}
  }
  const container = createContainer()
  pnt.appendChild(container.border)
  makeInputCheckBox(container.content, idCheckboxP4IsDrawing, 'isDrawing: ', edt.isDrawingP4,
    () => {
      edt.isDrawingP4 = getChecked(idCheckboxP4IsDrawing)
      edt.draw()
    })
  makeInputCheckBox(container.content, idCheckboxP4IsOn, 'isOn: ', false,
    () => {
      const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
      editInfo.p4Info.isOn = getChecked(idCheckboxP4IsOn)
      edt.draw()
    })
  makeInputNum(idInputP4LtX, container.content, 'lt.x: ', 0,
    () => {
      const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
      editInfo.p4Info.lt.x = getInputValueNumber(idInputP4LtX)
      if (editInfo.p4Info.isOn) {
        edt.draw()
        if (onChange) onChange()
      }
    }, 1)
  makeInputNum(idInputP4LtY, container.content, 'lt.y: ', 0,
    () => {
      const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
      editInfo.p4Info.lt.y = getInputValueNumber(idInputP4LtY)
      if (editInfo.p4Info.isOn) {
        edt.draw()
        if (onChange) onChange()
      }
    }, 1)
  makeInputNum(idInputP4RtX, container.content, 'rt.x: ', 100,
    () => {
      const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
      editInfo.p4Info.rt.x = getInputValueNumber(idInputP4RtX)
      if (editInfo.p4Info.isOn) {
        edt.draw()
        if (onChange) onChange()
      }
    }, 1)
  makeInputNum(idInputP4RtY, container.content, 'rt.y: ', 0,
    () => {
      const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
      editInfo.p4Info.rt.y = getInputValueNumber(idInputP4RtY)
      if (editInfo.p4Info.isOn) {
        edt.draw()
        if (onChange) onChange()
      }
    }, 1)
  makeInputNum(idInputP4LbX, container.content, 'lb.x: ', 0,
    () => {
      const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
      editInfo.p4Info.lb.x = getInputValueNumber(idInputP4LbX)
      if (editInfo.p4Info.isOn) {
        edt.draw()
        if (onChange) onChange()
      }
    }, 1)
  makeInputNum(idInputP4LbY, container.content, 'lb.y: ', 100,
    () => {
      const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
      editInfo.p4Info.lb.y = getInputValueNumber(idInputP4LbY)
      if (editInfo.p4Info.isOn) {
        edt.draw()
        if (onChange) onChange()
      }
    }, 1)
  makeInputNum(idInputP4RbX, container.content, 'rb.x: ', 100,
    () => {
      const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
      editInfo.p4Info.rb.x = getInputValueNumber(idInputP4RbX)
      if (editInfo.p4Info.isOn) {
        edt.draw()
        if (onChange) onChange()
      }
    }, 1)
  makeInputNum(idInputP4RbY, container.content, 'rb.y: ', 100,
    () => {
      const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
      editInfo.p4Info.rb.y = getInputValueNumber(idInputP4RbY)
      if (editInfo.p4Info.isOn) {
        edt.draw()
        if (onChange) onChange()
      }
    }, 1)
  makeBtnGroup(container.content, [
    {
      id: idBtnCalcP4, labelTxt: 'calculate p4',
      onClick: () => {
        const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
        edt.calculateP4()
        if (editInfo.p4Info.isOn) {
          edt.draw()
          if (onChange) onChange()
        }
      }
    }
  ])

  edt.calculateP4 = () => {
    const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
    let lineInfo = editInfo.lineInfo
    if (editInfo.transLine) lineInfo = editInfo.transLine
    editInfo.p4Info.lt.x = 0
    editInfo.p4Info.lt.y = 0
    editInfo.p4Info.rt.x = lineInfo.w
    editInfo.p4Info.rt.y = 0
    editInfo.p4Info.rb.x = lineInfo.w
    editInfo.p4Info.rb.y = lineInfo.h
    editInfo.p4Info.lb.x = 0
    editInfo.p4Info.lb.y = lineInfo.h
    changeInputValue(idInputP4LtX, editInfo.p4Info.lt.x)
    changeInputValue(idInputP4LtY, editInfo.p4Info.lt.y)
    changeInputValue(idInputP4RtX, editInfo.p4Info.rt.x)
    changeInputValue(idInputP4RtY, editInfo.p4Info.rt.y)
    changeInputValue(idInputP4RbX, editInfo.p4Info.rb.x)
    changeInputValue(idInputP4RbY, editInfo.p4Info.rb.y)
    changeInputValue(idInputP4LbX, editInfo.p4Info.lb.x)
    changeInputValue(idInputP4LbY, editInfo.p4Info.lb.y)
  }

  edt.updateP4Edit = () => {
    const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
    setChecked(idCheckboxP4IsOn, editInfo.p4Info.isOn)
    if (editInfo.p4Info.isOn) {
      changeInputValue(idInputP4LtX, editInfo.p4Info.lt.x)
      changeInputValue(idInputP4LtY, editInfo.p4Info.lt.y)
      changeInputValue(idInputP4RtX, editInfo.p4Info.rt.x)
      changeInputValue(idInputP4RtY, editInfo.p4Info.rt.y)
      changeInputValue(idInputP4RbX, editInfo.p4Info.rb.x)
      changeInputValue(idInputP4RbY, editInfo.p4Info.rb.y)
      changeInputValue(idInputP4LbX, editInfo.p4Info.lb.x)
      changeInputValue(idInputP4LbY, editInfo.p4Info.lb.y)
    } else {
      edt.calculateP4()
    }
  }

  return edt
}
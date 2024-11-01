function createEdtLineTransform(pnt, onChange, i=0) {
  const idCheckIsAutoTransform = `id-check-is-auto-transform-${i}`
  const idSelectSftRI = `id-select-sft-ri-${i}`
  const idInputScaleX = `id-input-scale-x-${i}`
  const idInputScaleY = `id-input-scale-y-${i}`
  const idInputDegree = `id-input-degree-${i}`
  const idBtnTransform = `id-btn-transform-${i}`
  const idBtnReset = `id-btn-reset-${i}`
  const edt ={
    eInfo: null,
    draw: () => {},
    update: () => {}
  }
  const container = createContainer()
  pnt.appendChild(container.border)
  makeInputCheckBox(container.content, idCheckIsAutoTransform, 'isAutoTransform: ', false, () => {})
  makeSelect(idSelectSftRI, container.content, 'sftRI: ', 'choose sftRI',
    () => {
      const eInfo = edt.eInfo
      const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
      editInfo.sftRIInfo.i = getInputValueNumber(idSelectSftRI)
      if (getChecked(idCheckIsAutoTransform)) {
        editByOrder(editInfo)
        edt.draw()
        if (onChange) onChange()
      }
    }, [0,1,2,3,4,5,6,7])
  makeInputNum(idInputScaleX, container.content, 'scaleX: ', 1,
    () => {
      const eInfo = edt.eInfo
      const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
      editInfo.scaleInfo.scaleX = getInputValueNumber(idInputScaleX)
      if (getChecked(idCheckIsAutoTransform)) {
        editByOrder(editInfo)
        edt.draw()
        if (onChange) onChange()
      }
    }, 0.01)
  makeInputNum(idInputScaleY, container.content, 'scaleY: ', 1,
    () => {
      const eInfo = edt.eInfo
      const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
      editInfo.scaleInfo.scaleY = getInputValueNumber(idInputScaleY)
      if (getChecked(idCheckIsAutoTransform)) {
        editByOrder(editInfo)
        edt.draw()
        if (onChange) onChange()
      }
    }, 0.01)
  makeInputNum(idInputDegree, container.content, 'degree: ', 0,
    () => {
      const eInfo = edt.eInfo
      const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
      editInfo.rotateInfo.degree = getInputValueNumber(idInputDegree)
      if (getChecked(idCheckIsAutoTransform)) {
        editByOrder(editInfo)
        edt.draw()
        if (onChange) onChange()
      }
    })
  makeBtnGroup(container.content, [
      {
        id: idBtnTransform, labelTxt: 'transform',
        onClick: () => {
          const eInfo = edt.eInfo
          const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
          editByOrder(editInfo)
          edt.draw()
          if (onChange) onChange()
        }
      },
      {
        id: idBtnReset, labelTxt: 'reset',
        onClick: () => {
          const eInfo = edt.eInfo
          const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
          editInfo.transLine = null
          edt.draw()
          if (onChange) onChange()
        }
      }
    ])
  edt.update = () => {
    const eInfo = edt.eInfo
    const editInfo = eInfo.lineEditInfo.list[eInfo.crntI]
    changeInputValue(idSelectSftRI, editInfo.sftRIInfo.i)
    changeInputValue(idInputScaleX, editInfo.scaleInfo.scaleX)
    changeInputValue(idInputScaleY, editInfo.scaleInfo.scaleY)
    changeInputValue(idInputDegree, editInfo.rotateInfo.degree)
  }
  return edt
}
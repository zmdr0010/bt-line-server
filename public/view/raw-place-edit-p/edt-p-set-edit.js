function createEdtPSetEdit(pnt, onChange, i=0) {
  const idTxtDivLineSize = `id-txt-div-line-size-${i}`
  const idInputChangeRawUCode = `id-input-change-raw-ucode-${i}`
  const idInputSzw = `id-input-szw-${i}`
  const idInputSzh = `id-input-szh-${i}`
  const idInputColor = `id-input-color-${i}`
  const idInputLineColor = `id-input-line-color-${i}`
  const idInputLineWidth = `id-input-line-width-${i}`
  const idSelectEditType = `id-select-edit-type-${i}`
  const idInputIList = `id-input-i-list-${i}`
  const idInputEdgeTypeList = `id-input-edge-type-list-${i}`
  const idBtnChangePSet = `id-btn-change-p-set-${i}`
  const edt = {
    changePSet: () => {},
    draw: () => {},
    updateCrnt: () => {},
    info: {
      szw: 0,
      szh: 0,
      color: '',
      lineColor: '',
      lineWidth: 1,
      editType: '',
      editTypeList: [],
      placeList: [],
      rawSetList: []
    },
    initEditTypeSelect: () => {
      initSelect(idSelectEditType, edt.info.editTypeList)
    }
  }
  const container = createContainer()
  container.content.innerText = 'edit pSet info'
  pnt.appendChild(container.border)
  makeSimpleTxtDiv(idTxtDivLineSize, container.content, '')
  makeInputText(idInputChangeRawUCode, container.content, 'raw uCode: ')
  makeInputNum(idInputSzw, container.content, 'szw: ', edt.info.szw,
    () => { edt.info.szw = getInputValueNumber(idInputSzw) })

  makeInputNum(idInputSzh, container.content, 'szh: ', edt.info.szh,
    () => { edt.info.szh = getInputValueNumber(idInputSzh) })

  makeInputText(idInputColor, container.content, 'color: ')
  changeInputValue(idInputColor, edt.info.color)

  makeInputText(idInputLineColor, container.content, 'line color: ')
  changeInputValue(idInputLineColor, edt.info.lineColor)

  makeInputNum(idInputLineWidth, container.content, 'line width: ', edt.info.lineWidth,
    () => {
      edt.info.lineWidth = getInputValueNumber(idInputLineWidth)
    })

  makeSelect(idSelectEditType, container.content, 'edit type: ', 'choose edit type',
    () => { edt.info.editType = getInputValue(idSelectEditType) })
  // initSelect(idSelectEditType, edt.info.editTypeList)

  makeInputText(idInputIList, container.content, 'iList: ')
  makeInputText(idInputEdgeTypeList, container.content, 'edge type list: ', 'change')
  makeBtnGroup(container.content, [{ id: idBtnChangePSet, labelTxt: 'change pSet',
    onClick: () => {
      edt.changePSet()
    } }])

  edt.changePSet = () => {
    const crntPlace = edt.info.placeList[edt.info.crntI]
    const pSet = crntPlace.pSetInfo
    pSet.rawUCode = getInputValue(idInputChangeRawUCode)
    pSet.szw = getInputValueNumber(idInputSzw)
    pSet.szh = getInputValueNumber(idInputSzh)
    pSet.color = getInputValue(idInputColor)
    pSet.lineColor = getInputValue(idInputLineColor)
    pSet.lineWidth = getInputValueNumber(idInputLineWidth)
    pSet.editType = getInputValue(idSelectEditType)

    pSet.iList = []
    const iListStr = getInputValue(idInputIList)
    if (iListStr.length > 0) {
      const iSplit = iListStr.split(',')
      for (const st of iSplit) pSet.iList.push(Number(st))
    }

    pSet.edgeTypeList = []
    const typeStr = getInputValue(idInputEdgeTypeList)
    const tSplit = typeStr.split(',')
    for (const st of tSplit) {
      if (st === 'left-top' || st === 'left-bottom'
        || st === 'right-top' || st === 'right-bottom'
        || st === 'left-top-inside' || st === 'left-bottom-inside'
        || st === 'right-top-inside' || st === 'right-bottom-inside') pSet.edgeTypeList.push(st)
    }

    makeLine(crntPlace, edt.info.rawSetList)
    changeSimpleTxtDiv(idTxtDivLineSize, `lineInfo w: ${crntPlace.lineInfo.w}, h: ${crntPlace.lineInfo.h}`)
    edt.draw()
    if (onChange) onChange()
  }

  edt.updateCrnt = () => {
    const crntPlace = edt.info.placeList[edt.info.crntI]
    const pSet = crntPlace.pSetInfo
    changeInputValue(idInputChangeRawUCode, pSet.rawUCode)
    changeInputValue(idInputSzw, pSet.szw)
    changeInputValue(idInputSzh, pSet.szh)
    changeInputValue(idInputColor, pSet.color)
    changeInputValue(idInputLineColor, pSet.lineColor)
    changeInputValue(idInputLineWidth, pSet.lineWidth)
    changeInputValue(idSelectEditType, pSet.editType)
    // initSelect(idSelectEditType, edt.info.editTypeList)
    if (pSet.iList.length > 0) {
      changeInputValue(idInputIList, pSet.iList.join(','))
    } else {
      changeInputValue(idInputIList, '')
    }
    if (pSet.edgeTypeList.length > 0) {
      changeInputValue(idInputEdgeTypeList, pSet.edgeTypeList.join(','))
    } else {
      changeInputValue(idInputEdgeTypeList, '')
    }
    changeSimpleTxtDiv(idTxtDivLineSize, `lineInfo w: ${crntPlace.lineInfo.w}, h: ${crntPlace.lineInfo.h}`)
  }

  return edt
}
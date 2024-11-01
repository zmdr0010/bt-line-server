// pnt: parent
function createEdtPlaceEditPUCode(pnt, onAdd, i=0) {
  const idInputPlaceUCode = `id-input-place-ucode-${i}`
  const idInputRawUCode = `id-input-raw-ucode-${i}`
  const idBtnPrint = `id-btn-place-print-${i}`
  const idBtnSave = `id-btn-place-save-${i}`
  const idBtnSaveToLine = `id-btn-save-to-line-${i}`
  const idTxtDivResult = `id-txt-div-result-${i}`
  const edt = {
    print: () => {},
    save: () => {},
    saveToLine: () => {},
    updateCrnt: () => {},
    getTxtDivResultId: () => { return idTxtDivResult },
    info: {
      placeEditPSetList: [],
      saveMode: 'new',
      placeList: [],
      rawSetList: [],
      editPSetInfoList: [],
      crntI: 0,
      sx: 0,
      sy: 0,
      szw: 0,
      szh: 0,
      color: '',
      lineColor: '',
      lineWidth: 1,
      editRawList: []
    }
  }

  const container = createContainer()
  pnt.appendChild(container.border)
  makeInputTextBtn(idInputPlaceUCode, container.content, 'place uCode: ', 'load',
    () => {
      const uCode = getInputValue(idInputPlaceUCode)
      const placeSet = edt.info.placeEditPSetList.find(p => p.split('/')[0] === uCode)
      let isNew = false
      if (edt.info.saveMode === 'new') isNew = true
      const placeInfo = createEditPPlaceInfo(placeSet, edt.info.editPSetInfoList, isNew)
      edt.info.placeList = placeInfo.list
      for (const p of edt.info.placeList) makeLine(p, edt.info.rawSetList)
      edt.info.crntI = 0
      edt.updateCrnt()
      if (onAdd) onAdd(edt.info.placeList[0], 'load')
    })
  makeInputTextBtn(idInputRawUCode, container.content, 'raw uCode: ', 'add',
    () => {
      const rawUCode = getInputValue(idInputRawUCode)

      const placeInfo = {
        x: edt.info.sx,
        y: edt.info.sy,
        pSetInfo: {
          uCode: `edit-p-set-${getCurrentDateUCode()}`,
          rawUCode: rawUCode,
          szw: edt.info.szw,
          szh: edt.info.szh,
          color: edt.info.color,
          lineColor: edt.info.lineColor,
          lineWidth: edt.info.lineWidth,
          editType: 'none',
          iList: [],
          edgeTypeList: []
        },
        lineInfo: null,
        editInfo: {
          transRawInfo: null,
          expandInfo: {
            isFit: true,
            sn: 1
          },
          addColumnInfo: {
            add: 0,
            target: 0
          },
          addRowInfo: {
            add: 0,
            target: 0
          },
          rotateIInfo: {
            i: 0
          }
        }
      }
      edt.info.placeList.push(placeInfo)
      edt.info.crntI = edt.info.placeList.length - 1
      makeLine(placeInfo, edt.info.rawSetList)
      edt.updateCrnt()
      if (onAdd) onAdd(placeInfo, 'add')
    })
  // list: [ { id: '', labelTxt: '', onClick: null } ]
  makeBtnGroup(container.content, [
    { id: idBtnPrint, labelTxt: 'print', onClick: () => { edt.print() } },
    { id: idBtnSave, labelTxt: 'save', onClick: () => { edt.save() } },
    { id: idBtnSaveToLine, labelTxt: 'save to line', onClick: () => { edt.saveToLine() } }
  ])
  makeSimpleTxtDiv(idTxtDivResult, container.content, '')

  edt.print = () => {
    console.log(edt.info)
  }

  // edt.save = () => {
  //   const uCode = `place-edit-p-set-${getCurrentDateUCode()}`
  //   const info = {
  //     uCode: uCode,
  //     list: edt.info.placeList
  //   }
  //   fitPlaceInfo(info)
  //   edt.info.placeList = info.list
  //   const str = createEditPPlaceStrSet(info)
  //   console.log(str)
  //   saveString(uCode, str)
  //   for (const p of edt.info.placeList) {
  //     const pSetStr = createEditPStrSet(p.pSetInfo)
  //     console.log(pSetStr)
  //     saveString(p.pSetInfo.uCode, pSetStr)
  //   }
  //
  //   for (const raw of edt.info.editRawList) {
  //     if (raw.rawInfo) {
  //       const rawSet = createRawStrSet(raw.rawInfo)
  //       saveString(raw.rawInfo.uCode, rawSet)
  //     }
  //   }
  // }
  //
  // edt.saveToLine = () => {
  //   const uCode = `place-edit-p-set-${getCurrentDateUCode()}`
  //   const info = {
  //     uCode: uCode,
  //     list: edt.info.placeList
  //   }
  //   fitPlaceInfo(info)
  //   edt.info.placeList = info.list
  //   const lineList = []
  //   console.log(edt.info.placeList)
  //   for (const p of edt.info.placeList) {
  //     makeLine(p, edt.info.rawSetList)
  //     if (p.lineInfo) {
  //       // p.lineInfo.x = p.x
  //       // p.lineInfo.y = p.y
  //       lineList.push(p.lineInfo)
  //     }
  //   }
  //   const mgLine = mergeSpLineInfo(`line-${getCurrentDateUCode()}`, lineList)
  //   const mgLineSet = createSimpleLineStrSet(mgLine)
  //   saveString(mgLine.uCode, mgLineSet)
  // }

  return edt
}
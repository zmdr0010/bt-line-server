function createEdtRawPlace(pnt, onEdit, i=0) {
  const idTxtDivRawSize = `id-txt-div-raw-size-${i}`
  const idTxtDivMouseDown = `id-txt-div-mouse-down-${i}`
  const idTxtDivMtxInfo = `id-txt-div-mtx-info-${i}`
  const idCheckboxIsMouseEditing = `id-checkbox-is-mouse-editing-${i}`
  const idCheckboxIsKeyboardEditing = `id-checkbox-is-keyboard-editing-${i}`
  const idBtnEdit = `id-btn-edit-${i}`
  const idBtnReset = `id-btn-reset-${i}`
  const idInputRawSx = `id-input-raw-sx-${i}`
  const idInputRawSy = `id-input-raw-sy-${i}`
  const idInputRawSzw = `id-input-raw-szw-${i}`
  const idInputRawSzh = `id-input-raw-szh-${i}`
  const edt = {
    info: {
      sx: 0,
      sy: 0,
      isMouseEditing: false,
      isKeyboardEditing: false,
      kEditor: {
        c: -1,
        r: -1,
        color: 'red',
        radius: 8,
        keyLeft: 'b',
        keyRight: 'm',
        keyUp: 'h',
        keyDown: 'n',
        keyOnOff: 'd'
      }
    },
    rawEdit: {
      szw: 0,
      szh: 0
    },
    resetTransInfo: () => {
      edt.rawEdit.transRawInfo = null
      edt.updateKeyInfoMap()
      edt.draw()
    },
    draw: () => {},
    updateMtxInfo: () => {
      const rawEdit = edt.rawEdit
      const keyList = getKeyList()
      let str = ''
      for (const key of keyList) {
        const keyInfo = rawEdit.keyInfoMap.get(key)
        if (keyInfo) {
          str += `${key}: [ `
          for (const i of keyInfo.iList) {
            str += `${i}, `
          }
          str = str.slice(0, str.length-2)
          str += ' ]\n\n'
        }
      }
      changeSimpleTxtDiv(idTxtDivMtxInfo, str)
    },
    updateRawSizeTxt: () => {
      const rawEdit = edt.rawEdit
      let rawInfo = rawEdit.rawInfo
      if (rawEdit.transRawInfo) rawInfo = rawEdit.transRawInfo
      // update raw size txt
      changeSimpleTxtDiv(idTxtDivRawSize, `column: ${rawInfo.column}, row: ${rawInfo.row}`)
    },
    updateKeyInfoMap: () => {
      const rawEdit = edt.rawEdit
      let rawInfo = rawEdit.rawInfo
      if (rawEdit.transRawInfo) rawInfo = rawEdit.transRawInfo
      const map = createKeyInfoMap(rawInfo)
      console.log(map)
      rawEdit.keyInfoMap = map
      edt.updateMtxInfo()
      edt.updateRawSizeTxt()
    },
    updateSzWY: () => {
      changeInputValue(idInputRawSzw, edt.rawEdit.szw)
      changeInputValue(idInputRawSzh, edt.rawEdit.szh)
    },
    addMouseDown: (canvas) => {
      canvas.addEventListener('mousedown', (e) => {
        console.log(`mouse down offset x: ${e.offsetX}, y: ${e.offsetY}`)
        if (!edt.rawEdit) return
        const rawEdit = edt.rawEdit
        let rawInfo = rawEdit.transRawInfo
        if (!rawInfo) {
          rawInfo = structuredClone(rawEdit.rawInfo)
          rawEdit.transRawInfo = rawInfo
          rawInfo.uCode = `raw-${getCurrentDateUCode()}`
        }
        const mouseX = e.offsetX
        const mouseY = e.offsetY
        const sx = edt.info.sx
        const sy = edt.info.sy
        const szw = rawEdit.szw
        const szh = rawEdit.szh
        const c = Math.floor((mouseX - sx) / szw)
        const r = Math.floor((mouseY - sy) / szh)
        const index = r * rawInfo.column + c
        console.log(`c: ${c}, r: ${r}, index: ${index}`)
        const str = `mouse down:  c: ${c}, r: ${r}, index: ${index} (x: ${e.offsetX}, y: ${e.offsetY})`
        changeSimpleTxtDiv(idTxtDivMouseDown, str)
        if (edt.info.isMouseEditing && !(c >= rawInfo.column || r >= rawInfo.row)) {
          const oRw = rawInfo.raw[index]
          let rw = 0
          if (oRw === 0) rw = 1
          rawInfo.raw[index] = rw
          edt.updateKeyInfoMap()
          edt.draw()
        }
      })
    },
    addKeyDown: () => {
      document.addEventListener('keydown', (e) => {
        const kEditor = edt.info.kEditor
        const rawEdit = edt.rawEdit
        if (e.key === kEditor.keyLeft) {
          kEditor.c--
          edt.draw()
        }
        if (e.key === kEditor.keyRight) {
          kEditor.c++
          edt.draw()
        }
        if (e.key === kEditor.keyUp) {
          kEditor.r--
          edt.draw()
        }
        if (e.key === kEditor.keyDown) {
          kEditor.r++
          edt.draw()
        }
        if (e.key === kEditor.keyOnOff) {
          let rawInfo = rawEdit.transRawInfo
          if (!rawInfo) {
            rawInfo = structuredClone(rawEdit.rawInfo)
            rawEdit.transRawInfo = rawInfo
            rawInfo.uCode = `raw-${getCurrentDateUCode()}`
          }
          const c = kEditor.c
          const r = kEditor.r
          if (c < 0 || c >= rawInfo.column) return
          if (r < 0 || r >= rawInfo.row) return
          const index = r * rawInfo.column + c
          const oRw = rawInfo.raw[index]
          let rw = 0
          if (oRw === 0) rw = 1
          rawInfo.raw[index] = rw
          edt.updateKeyInfoMap()
          edt.draw()
        }
      })
    }
  }
  const container = createContainer()
  pnt.appendChild(container.border)
  makeSimpleTxtDiv(idTxtDivRawSize, container.content, 'raw size')
  makeSimpleTxtDiv(idTxtDivMouseDown, container.content, 'mouse down info')
  makeSimpleTxtDiv(idTxtDivMtxInfo, container.content, 'mtx info')
  makeInputCheckBox(container.content, idCheckboxIsMouseEditing, 'isMouseEditing', edt.info.isMouseEditing,
    () => { edt.info.isMouseEditing = getChecked(idCheckboxIsMouseEditing) })
  makeInputCheckBox(container.content, idCheckboxIsKeyboardEditing, 'isKeyboardEditing', edt.info.isKeyboardEditing,
    () => {
      edt.info.isKeyboardEditing = getChecked(idCheckboxIsKeyboardEditing)
      edt.draw()
    })
  makeBtnGroup(container.content, [
    { id: idBtnEdit, labelTxt: 'edit',
      onClick: () => {
        if (onEdit) onEdit()
      } },
    { id: idBtnReset, labelTxt: 'reset',
      onClick: () => {
        edt.resetTransInfo()
      } }
  ])
  makeInputNum(idInputRawSx, container.content, 'sx: ', 0,
    () => {
      edt.info.sx = getInputValueNumber(idInputRawSx)
      edt.draw()
    })
  makeInputNum(idInputRawSy, container.content, 'sy: ', 0,
    () => {
      edt.info.sy = getInputValueNumber(idInputRawSy)
      edt.draw()
    })
  makeInputNum(idInputRawSzw, container.content, 'szw: ', 20,
    () => {
      if (edt.rawEdit) edt.rawEdit.szw = getInputValueNumber(idInputRawSzw)
      edt.draw()
    })
  makeInputNum(idInputRawSzh, container.content, 'szy: ', 20,
    () => {
      if (edt.rawEdit) edt.rawEdit.szh = getInputValueNumber(idInputRawSzh)
      edt.draw()
    })

  return edt
}
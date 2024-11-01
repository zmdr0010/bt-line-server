function createEdtRawAddRow(pnt, onAdd, i=0) {
  const idInputAddRowR = `id-input-add-row-r-${i}`
  const idInputAddRow = `id-input-add-row-${i}`
  const edt = {
    rawEdit: null,
    draw: () => {},
    updateKeyInfoMap: () => {}
  }
  const container = createContainer()
  pnt.appendChild(container.border)
  makeInputNum(idInputAddRowR, container.content, 'add row r: ', 0,
    () => {
      const rawEdit = edt.rawEdit
      if (rawEdit) rawEdit.addRowInfo.target = getInputValueNumber(idInputAddRowR)
    })
  makeInputNumBtn(idInputAddRow, container.content, 'add: ', 'add r',
    () => {
      const rawEdit = edt.rawEdit
      if (!rawEdit) return
      rawEdit.addRowInfo.add = getInputValueNumber(idInputAddRow)
      if (rawEdit.addRowInfo.add !== 0) {
        let rawInfo = rawEdit.rawInfo
        if (rawEdit.transRawInfo) rawInfo = rawEdit.transRawInfo
        if (rawEdit.addRowInfo.add > 0) {
          rawEdit.transRawInfo = addRow(rawInfo, rawEdit.addRowInfo.target, rawEdit.addRowInfo.add)
        } else {
          rawEdit.transRawInfo = removeRow(rawInfo, rawEdit.addRowInfo.target, rawEdit.addRowInfo.add)
        }
        edt.updateKeyInfoMap()
        if (onAdd) onAdd()
      }
      edt.draw()
    }, 0)
  return edt
}
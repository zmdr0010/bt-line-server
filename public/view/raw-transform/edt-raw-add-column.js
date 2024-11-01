function createEdtRawAddColumn(pnt, onAdd, i=0) {
  const idInputAddColumnC = `id-input-add-column-c-${i}`
  const idInputAddColumn = `id-input-add-column-${i}`
  const edt = {
    rawEdit: null,
    draw: () => {},
    updateKeyInfoMap: () => {}
  }
  const container = createContainer()
  pnt.appendChild(container.border)
  makeInputNum(idInputAddColumnC, container.content, 'add column c: ', 0,
    () => {
      const rawEdit = edt.rawEdit
      if (rawEdit) rawEdit.addColumnInfo.target = getInputValueNumber(idInputAddColumnC)
    })
  makeInputNumBtn(idInputAddColumn, container.content, 'add: ', 'add c',
    () => {
      const rawEdit = edt.rawEdit
      if (!rawEdit) return
      rawEdit.addColumnInfo.add = getInputValueNumber(idInputAddColumn)
      if (rawEdit.addColumnInfo.add !== 0) {
        let rawInfo = rawEdit.rawInfo
        if (rawEdit.transRawInfo) rawInfo = rawEdit.transRawInfo
        if (rawEdit.addColumnInfo.add > 0) {
          rawEdit.transRawInfo = addColumn(rawInfo, rawEdit.addColumnInfo.target, rawEdit.addColumnInfo.add)
        } else {
          rawEdit.transRawInfo = removeColumn(rawInfo, rawEdit.addColumnInfo.target, rawEdit.addColumnInfo.add)
        }
        edt.updateKeyInfoMap()
        if (onAdd) onAdd()
      }
      edt.draw()
    }, 0)
  return edt
}
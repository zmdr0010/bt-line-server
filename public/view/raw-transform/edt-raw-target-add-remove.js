function createEdtRawTargetAddRemove(pnt, onEdit, i=0) {
  const idInputRemoveRawIList = `id-input-remove-raw-i-list-${i}`
  const idInputAddRawIList = `id-input-add-raw-i-list-${i}`
  const edt = {
    rawEdit: null,
    removeRawIList: () => {
      const rawEdit = edt.rawEdit
      if (!rawEdit.transRawInfo) rawEdit.transRawInfo = structuredClone(rawEdit.rawInfo)
      const str = getInputValue(idInputRemoveRawIList)
      const split = str.split(',')
      for (const iStr of split) {
        const i = Number(iStr)
        rawEdit.transRawInfo.raw[i] = 0
      }
      edt.updateKeyInfoMap()
      if (onEdit) onEdit()
      edt.draw()
    },
    addRawIList: () => {
      const rawEdit = edt.rawEdit
      if (!rawEdit.transRawInfo) rawEdit.transRawInfo = structuredClone(rawEdit.rawInfo)
      const str = getInputValue(idInputAddRawIList)
      const split = str.split(',')
      for (const iStr of split) {
        const i = Number(iStr)
        rawEdit.transRawInfo.raw[i] = 1
      }
      edt.updateKeyInfoMap()
      if (onEdit) onEdit()
      edt.draw()
    },
    draw: () => {},
    updateKeyInfoMap: () => {}
  }
  const container = createContainer()
  pnt.appendChild(container.border)
  makeInputTextBtn(idInputRemoveRawIList, container.content, 'raw iList: ', 'remove',
    () => { edt.removeRawIList() })
  makeInputTextBtn(idInputAddRawIList, container.content, 'raw iList: ', 'add',
    () => { edt.addRawIList() })
  return edt
}
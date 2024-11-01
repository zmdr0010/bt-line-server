function createEdtRawExpand(pnt, onExpand, i=0) {
  const idCheckboxExpandFit = `id-checkbox-expand-fit-${i}`
  const idInputExpandSn = `id-input-expand-sn-${i}`
  const edt = {
    rawEdit: null,
    draw: () => {},
    updateKeyInfoMap: () => {}
  }
  const container = createContainer()
  pnt.appendChild(container.border)
  makeInputCheckBox(container.content, idCheckboxExpandFit, 'fit expand', true,
    () => {
      const rawEdit = edt.rawEdit
      if (rawEdit) rawEdit.expandInfo.isFit = getChecked(idCheckboxExpandFit)
    })
  makeInputNumBtn(idInputExpandSn, container.content, 'expand sn: ', 'expand',
    () => {
      const rawEdit = edt.rawEdit
      if (!rawEdit) return
      rawEdit.expandInfo.sn = getInputValueNumber(idInputExpandSn)

      if (rawEdit.expandInfo.sn > 1) {
        if (rawEdit.transRawInfo) {
          rawEdit.transRawInfo = expandRawSimple(rawEdit.transRawInfo, rawEdit.expandInfo.sn)
        } else {
          rawEdit.transRawInfo = expandRawSimple(rawEdit.rawInfo, rawEdit.expandInfo.sn)
        }
        edt.updateKeyInfoMap()
        if (onExpand) onExpand()
      }
      edt.draw()
    }, 1)
  return edt
}
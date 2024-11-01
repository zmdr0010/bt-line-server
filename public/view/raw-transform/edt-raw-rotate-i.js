function createEdtRawRotateI(pnt, onRotate, i=0) {
  const idSelectRotateI = `id-select-rotate-i-${i}`
  const idBtnRotateI = `id-btn-rotate-i-${i}`
  const edt = {
    rawEdit: null,
    draw: () => {},
    updateKeyInfoMap: () => {}
  }
  const container = createContainer()
  pnt.appendChild(container.border)
  makeSelect(idSelectRotateI, container.content, 'rotateI: ', 'choose rotateI',
    () => {
      const rawEdit = edt.rawEdit
      if (rawEdit) rawEdit.rotateIInfo.i = getInputValueNumber(idSelectRotateI)
    }, [0,1,2,3,4,5,6,7])
  makeBtnGroup(container.content, [{ id: idBtnRotateI, labelTxt: 'rotateI',
    onClick: () => {
      const rawEdit = edt.rawEdit
      if (!rawEdit) return
      if (rawEdit.rotateIInfo.i > 0) {
        let rawInfo = rawEdit.rawInfo
        if (rawEdit.transRawInfo) rawInfo = rawEdit.transRawInfo
        rawEdit.transRawInfo = shiftByRotateI(rawInfo, rawEdit.rotateIInfo.i)
        edt.updateKeyInfoMap()
        if (onRotate) onRotate()
        edt.draw()
      }
    }}])
  return edt
}
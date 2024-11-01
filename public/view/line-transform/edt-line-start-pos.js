function createEdtLineStartPos(pnt, i=0) {
  const idInputSx = `id-input-sx-${i}`
  const idInputSy = `id-input-sy-${i}`
  const edt = {
    eInfo: null,
    draw: () => {},
    updateInput: () => {
      changeInputValue(idInputSx, edt.eInfo.lineEditInfo.sx)
      changeInputValue(idInputSy, edt.eInfo.lineEditInfo.sy)
    }
  }
  const container = createContainer()
  pnt.appendChild(container.border)
  makeInputNum(idInputSx, container.content, 'sx: ', 0,
    () => {
      edt.eInfo.lineEditInfo.sx = getInputValueNumber(idInputSx)
      edt.draw()
    })
  makeInputNum(idInputSy, container.content, 'sy: ', 0,
    () => {
      edt.eInfo.lineEditInfo.sy = getInputValueNumber(idInputSy)
      edt.draw()
    })
  return edt
}
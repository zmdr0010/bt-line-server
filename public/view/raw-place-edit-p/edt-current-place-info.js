function createEdtCurrentPlaceInfo(pnt, onChange, i=0) {
  const idTxtDivLinePlace = `id-txt-div-line-place-${i}`
  const idBtnNext = `id-btn-next-${i}`
  const idBtnPrev = `id-btn-prev-${i}`
  const idBtnFront = `id-btn-front-${i}`
  const idBtnBack = `id-btn-back-${i}`
  const idBtnRemove = `id-btn-remove-${i}`
  const idInputLineX = `id-input-line-x-${i}`
  const idInputLineY = `id-input-line-y-${i}`
  const edt = {
    updateCrnt: () => {},
    draw: () => {},
    info: {
      crntI: 0,
      placeList: []
    },
    getCrntPlace: () => {
      return edt.info.placeList[edt.info.crntI]
    }
  }

  const container = createContainer()
  container.content.innerText = 'current place info'
  pnt.appendChild(container.border)
  makeSimpleTxtDiv(idTxtDivLinePlace, container.content, `[${edt.info.crntI}]`)
  makeBtnGroup(container.content, [
    { id: idBtnNext, labelTxt: 'next',
      onClick: () => {
        edt.info.crntI++
        if (edt.info.crntI >= edt.info.placeList.length) edt.info.crntI = 0
        edt.updateCrnt()
        if (onChange) onChange(edt.getCrntPlace(), 'next')
      } },
    { id: idBtnPrev, labelTxt: 'prev',
      onClick: () => {
        edt.info.crntI--
        if (edt.info.crntI < 0) edt.info.crntI = edt.info.placeList.length - 1
        edt.updateCrnt()
        if (onChange) onChange(edt.getCrntPlace(), 'prev')
      } },
    { id: idBtnFront, labelTxt: 'front',
      onClick: () => {
        if (edt.info.placeList.length < 0) return
        let next = edt.info.crntI + 1
        if (next >= edt.info.placeList.length) next = edt.info.placeList.length - 1
        if (edt.info.crntI === next) return
        const nLine = edt.info.placeList[next]
        const crnt = edt.info.placeList[edt.info.crntI]
        edt.info.placeList[edt.info.crntI] = nLine
        edt.info.placeList[next] = crnt
        edt.info.crntI = next
        edt.updateCrnt()
      } },
    { id: idBtnBack, labelTxt: 'back',
      onClick: () => {
        if (edt.info.placeList.length < 0) return
        let prev = edt.info.crntI - 1
        if (prev < 0) prev = 0
        if (edt.info.crntI === prev) return
        const pLine = edt.info.placeList[prev]
        const crnt = edt.info.placeList[edt.info.crntI]
        edt.info.placeList[prev] = crnt
        edt.info.placeList[edt.info.crntI] = pLine
        edt.info.crntI = prev
        edt.updateCrnt()
      } },
    { id: idBtnRemove, labelTxt: 'remove',
      onClick: () => {
        if (edt.info.placeList.length < 0) return
        edt.info.placeList.splice(edt.info.crntI, 1)
        if (edt.info.placeList.length <= 0) {
          edt.info.crntI = -1
          edt.draw()
        } else {
          edt.info.crntI = 0
          edt.updateCrnt()
        }
        if (onChange) onChange(edt.getCrntPlace(), 'remove')
      } },
  ])
  makeInputNum(idInputLineX, container.content, 'x: ', 0,
    () => {
      const crntPlace = edt.info.placeList[edt.info.crntI]
      crntPlace.x = getInputValueNumber(idInputLineX)
      crntPlace.lineInfo.x = crntPlace.x
      edt.draw()
    })
  makeInputNum(idInputLineY, container.content, 'y: ', 0,
    () => {
      const crntPlace = edt.info.placeList[edt.info.crntI]
      crntPlace.y = getInputValueNumber(idInputLineY)
      crntPlace.lineInfo.y = crntPlace.y
      edt.draw()
    })

  edt.updateCrnt = () => {
    const crntPlace = edt.info.placeList[edt.info.crntI]
    changeInputValue(idInputLineX, crntPlace.x)
    changeInputValue(idInputLineY, crntPlace.y)
    changeSimpleTxtDiv(idTxtDivLinePlace, `[${edt.info.crntI}]`)
  }

  return edt
}
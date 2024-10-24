const CmpRawDrawer = {
  create: function (column=20, row=20, szw=20, szh=20) {
    const drawer = {
      column: column,
      row: row,
      szw: szw,
      szh: szh,
      offColor: 'lightgray',
      onColor: 'slategray',
      borderColor: 'LightSteelBlue',
      keyLeft: 'b',
      keyRight: 'm',
      keyUp: 'h',
      keyDown: 'n',
      keyOnOff: 'd',
      container: null
    }

    let crntC = -1
    let crntR = -1

    function init() {
      const container = createContainer()
      drawer.container = container
      container.content.style.display = 'inline-block'
      container.border.id = 'id-container-border-cmp-raw-drawer'
      container.border.style.width = `${drawer.column * drawer.szw + 22}px`
      container.border.style.height = `${drawer.row * drawer.szh + 22}px`
      makeRawBoard()
      return container.border
    }

    function makeRawBoard() {
      for (let i=0; i<drawer.row; i++) {
        const rDiv = document.createElement('div')
        rDiv.id = `id-r-${i}`
        rDiv.style.display = 'flex'
        rDiv.style.width = `${drawer.column * drawer.szw}px`
        for (let j=0; j<drawer.column; j++) {
          const cDiv = document.createElement('div')
          const id = i * drawer.column + j
          cDiv.id = `id-c-${id}`
          cDiv.style.width = `${szw}px`
          cDiv.style.height = `${szh}px`
          cDiv.style.backgroundColor = drawer.offColor
          cDiv.addEventListener('click', () => {
            if (cDiv.style.backgroundColor === drawer.offColor) {
              cDiv.style.backgroundColor = drawer.onColor
            } else {
              cDiv.style.backgroundColor = drawer.offColor
            }
          })
          rDiv.appendChild(cDiv)
        }
        drawer.container.content.appendChild(rDiv)
      }
    }

    function changeDrawerSize(column, row, szw, szh) {
      drawer.column = column
      drawer.row = row
      drawer.szw = szw
      drawer.szh = szh
      drawer.container.border.style.width = `${drawer.column * drawer.szw + 22}px`
      drawer.container.border.style.height = `${drawer.row * drawer.szh + 22}px`
      drawer.container.content.innerHTML = ''
      makeRawBoard()
    }

    function getRawInfo(isOnFit=true) {
      const aList = []
      const dColumn = drawer.column
      const dRow = drawer.row
      const length = dColumn * dRow
      let minC = 100000
      let maxC = 0
      let minR = 100000
      let maxR = 0
      for (let i=0; i<length; i++) {
        const div = document.getElementById(`id-c-${i}`)
        let rw = 0
        if (div.style.backgroundColor === drawer.onColor.toLowerCase()) rw = 1
        const c = i % dColumn
        const r = Math.floor(i / dColumn)
        if (rw === 1) {
          minC = Math.min(minC, c)
          maxC = Math.max(maxC, c)
          minR = Math.min(minR, r)
          maxR = Math.max(maxR, r)
        }
        aList.push(rw)
      }
      let list = []
      let rColumn = dColumn
      let rRow = dRow
      if (isOnFit) {
        console.log(`minC: ${minC}, maxC: ${maxC}, minR: ${minR}, maxR: ${maxR}`)
        rColumn = maxC - minC + 1
        rRow = maxR - minR + 1
        for (let i=minR; i<=maxR; i++) {
          for (let j=minC; j<=maxC; j++) {
            list.push(aList[i * dColumn + j])
          }
        }
      } else {
        list = aList
      }

      if (list.length < 1) return null
      return {
        uCode: `raw-${getCurrentDateUCode()}`,
        column: rColumn,
        row: rRow,
        raw: list,
        rawNum: rColumn * rRow
      }
    }

    function move(key) {
      console.log(`rawDrawer move ${key}`)
      const prevC = crntC
      const prevR = crntR
      let dir = [0,0]
      if (key === drawer.keyLeft) dir = [-1,0]
      if (key === drawer.keyRight) dir = [1,0]
      if (key === drawer.keyUp) dir = [0,-1]
      if (key === drawer.keyDown) dir = [0,1]
      crntR += dir[1]
      crntC += dir[0]
      if (crntR < 0) crntR = 0
      if (crntR >= drawer.row) crntR = drawer.row - 1
      if (crntC < 0) crntC = 0
      if (crntC >= drawer.column) crntC = drawer.column - 1

      if (prevR >= 0 && prevC >= 0) {
        const i = prevR * drawer.column + prevC
        const id = `id-c-${i}`
        const div = document.getElementById(id)
        div.style.opacity = '1.0'
      }

      const crntI = crntR * drawer.column + crntC
      const crntId = `id-c-${crntI}`
      const crntDiv = document.getElementById(crntId)
      crntDiv.style.opacity = '0.5'
    }

    function downD() {
      const crntI = crntR * drawer.column + crntC
      const crntId = `id-c-${crntI}`
      const crntDiv = document.getElementById(crntId)
      if (crntDiv.style.backgroundColor === drawer.offColor) {
        crntDiv.style.backgroundColor = drawer.onColor
      } else {
        crntDiv.style.backgroundColor = drawer.offColor
      }
    }

    function onKeyDown(e) {
      console.log(`rawDrawer down key : ${e.key}`)
      if (e.key === drawer.keyLeft || e.key === drawer.keyRight
        || e.key === drawer.keyUp || e.key === drawer.keyDown) move(e.key)
      if (e.key === drawer.keyOnOff) downD()
    }

    function changeBorder(isOn) {
      const dColumn = drawer.column
      const dRow = drawer.row
      const length = dColumn * dRow
      for (let i=0; i<length; i++) {
        const div = document.getElementById(`id-c-${i}`)
        const border = document.getElementById('id-container-border-cmp-raw-drawer')
        if (isOn) {
          div.style.border = `solid ${drawer.borderColor} 1px`
          border.style.height = `${drawer.row * drawer.szh + drawer.szh * 2 + 22}px`
        } else {
          div.style.border = ''
          border.style.height = `${drawer.row * drawer.szh + 22}px`
        }
      }
    }

    function changeOnColor(color) {
      drawer.onColor = color
    }

    function changeOffColor(color) {
      drawer.offColor = color
    }

    function update(column, row, raw) {
      for (let i=0; i<raw.length; i++) {
        const rw = raw[i]
        const c = i % column
        const r = Math.floor(i / column)
        if (c >= drawer.column || r >= drawer.row) continue
        const index = r * drawer.column + c
        const id = `id-c-${index}`
        const div = document.getElementById(id)
        if (rw === 0) {
          div.style.backgroundColor = drawer.offColor
        } else {
          div.style.backgroundColor = drawer.onColor
        }
      }
    }

    return {
      init: init,
      getRawInfo: getRawInfo,
      onKeyDown: onKeyDown,
      changeBorder: changeBorder,
      changeDrawerSize: changeDrawerSize,
      changeOnColor: changeOnColor,
      changeOffColor: changeOffColor,
      update: update,
      column: drawer.column,
      row: drawer.row,
      szw: drawer.szw,
      szh: drawer.szh,
      offColor: drawer.offColor,
      onColor: drawer.onColor,
      keyLeft: drawer.keyLeft,
      keyRight: drawer.keyRight,
      keyUp: drawer.keyUp,
      keyDown: drawer.keyDown,
      keyOnOff: drawer.keyOnOff
    }
  }
}
function createSimplePartInfo(uCode, tCode, lineInfo, x=0, y=0) {
  const w = lineInfo.w
  const h = lineInfo.h

  return {
    uCode: uCode,
    w: w,
    h: h,
    x: x,
    y: y,
    tCode: tCode,
    lineInfo: lineInfo,
    order: [],
    child: []
  }
}

function createSimpleRectLineInfo(uCode, w, h, color='black', width=1) {
  const lineInfo = {
    uCode: uCode,
    w: w,
    h: h,
    x: 0,
    y: 0,
    list: [
      {
        width: width, // 0: (fill), 1 ~ n: (stroke), lineWidth
        color: color,
        // points: [0,0, 200,0, 200,70, 120,70, 120,150, 80,150, 80,70, 0,70, 0,0],
        list: [ // pointInfo list
          // draw x, y <- x + dx, y + dy
          {x:0,y:0,dx:0,dy:0}, {x:w,y:0,dx:0,dy:0}, {x:w,y:h,dx:0,dy:0},
          {x:0,y:h,dx:0,dy:0}, {x:0,y:0,dx:0,dy:0},
        ]
      }
    ],
    child: []
  }
  return lineInfo
}

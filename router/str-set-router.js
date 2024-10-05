const express = require('express')
const router = express.Router()
const strSetManager = require('../mdl/str-set-sql3-manager')

function init(path, name) {
  strSetManager.init(path, name)
}
exports.init = init

router.use(function timeLog(req, res, next) {
  console.log(`[${new Date()}] ${req.baseUrl + req.path} ${req.method}`)
  next()
})

router.get('/', (req, res) => {
  res.send('str-set')
})

router.post('/add-str', (req, res) => {
  console.log(req.body)
  const uCode = req.body.ucode
  const str = req.body.str
  const dsg = req.body.dsg
  const type = req.body.type
  const memo0 = req.body.memo0
  const memo1 = req.body.memo1
  const memo2 = req.body.memo2
  console.log(`uCode: ${uCode}, str: ${str}, dsg: ${dsg}, type: ${type}, memo0: ${memo0}, memo1: ${memo1}, memo2: ${memo2}`)
  // res.send(`uCode: ${uCode}, str: ${str}, dsg: ${dsg}, type: ${type}, memo0: ${memo0}, memo1: ${memo1}, memo2: ${memo2}`)
  strSetManager.addStr(uCode, str, dsg, type, memo0, memo1, memo2, (result) => {
    console.log(result)
    res.send(JSON.stringify(result))
  })
})

router.get('/line-set-list', (req, res) => {
  strSetManager.getLineSetList((result) => {
    res.send(JSON.stringify(result))
  })
})

router.get('/line-point-set-list', (req, res) => {
  strSetManager.getLinePointSetList((result) => {
    res.send(JSON.stringify(result))
  })
})

router.get('/coloring-line-point-set-list', (req, res) => {
  strSetManager.getColoringAndLinePoint((result) => {
    res.send(JSON.stringify(result))
  })
})

exports.router = router

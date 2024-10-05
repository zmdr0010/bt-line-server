const express = require('express')
const router = express.Router()

router.use(function timeLog(req, res, next) {
  console.log(`[${new Date()}] ${req.baseUrl + req.path} ${req.method}`)
  next()
})

router.get('/adding-str', (req, res) => {
  res.render('add-str-set.html')
})

router.get('/line-list', (req, res) => {
  res.render('line-list.html')
})

router.get('/making-line-point', (req, res) => {
  res.render('making-line-point.html')
})

router.get('/line-point-list', (req, res) => {
  res.render('line-point-list.html')
})

exports.router = router

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

router.get('/making-line-point-v1', (req, res) => {
  res.render('making-line-point-v1.html')
})

router.get('/making-line-point-v1-load', (req, res) => {
  res.render('making-line-point-v1-load.html')
})

router.get('/making-line-point-v2', (req, res) => {
  res.render('making-line-point-v2.html')
})

router.get('/making-line-point-v3', (req, res) => {
  res.render('making-line-point-v3.html')
})

router.get('/line-point-list', (req, res) => {
  res.render('line-point-list.html')
})

router.get('/coloring-line-point-list', (req, res) => {
  res.render('coloring-line-point-list.html')
})

router.get('/place-line', (req, res) => {
  res.render('place-line.html')
})

router.get('/place-line-list', (req, res) => {
  res.render('place-line-list.html')
})

router.get('/coloring-line', (req, res) => {
  res.render('coloring-line.html')
})

router.get('/coloring-line-list', (req, res) => {
  res.render('coloring-line-list.html')
})

exports.router = router

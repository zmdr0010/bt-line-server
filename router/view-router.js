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

router.get('/line-list-memo1', (req, res) => {
  res.render('line-list-memo1.html')
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

router.get('/preset-bundle-list', (req, res) => {
  res.render('preset-bundle-list.html')
})

router.get('/preset-bundle-edit', (req, res) => {
  res.render('preset-bundle-edit.html')
})

router.get('/dvc-srt-bundle-list', (req, res) => {
  res.render('dvc-srt-bundle-list.html')
})

router.get('/making-dvc-srt-bundle', (req, res) => {
  res.render('making-dvc-srt-bundle.html')
})

router.get('/making-simple-raw', (req, res) => {
  res.render('making-simple-raw.html')
})

router.get('/raw-list', (req, res) => {
  res.render('raw-list')
})

router.get('/raw-simple-edit', (req, res) => {
  res.render('raw-simple-edit.html')
})

router.get('/place-raw-edit-p', (req, res) => {
  res.render('place-raw-edit-p.html')
})

router.get('/place-raw-edit-p-list', (req, res) => {
  res.render('place-raw-edit-p-list.html')
})

router.get('/transform-raw', (req, res) => {
  res.render('transform-raw.html')
})

router.get('/transform-raw-list', (req, res) => {
  res.render('transform-raw-list')
})

router.get('/transform-line', (req, res) => {
  res.render('transform-line.html')
})

router.get('/making-raw-edit-p', (req, res) => {
  res.render('making-raw-edit-p')
})

router.get('/raw-edit-p-list', (req, res) => {
  res.render('raw-edit-p-list.html')
})

exports.router = router

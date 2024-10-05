const express = require('express')
const ipChecker = require('./mdl/ip-checker')
const app = express()
const fs = require('node:fs')
const configJson = fs.readFileSync('./config.json', 'utf8')
const config = JSON.parse(configJson)
const port = config.port
const strSetRouter = require('./router/str-set-router')
const viewRouter = require('./router/view-router')

strSetRouter.init(config.dbPath, config.dbName)

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // body parser
app.use('/str-set', strSetRouter.router)
app.use('/', viewRouter.router) // html script src: ex. '/': fnc/fnc-draw.js <-> '/view': ../fnc/fnc-draw.js

app.get('/', (req, res) => {
  res.send('bt-line')
})

app.listen(port, () => {
  console.log(`server start ip ${ipChecker.getIp()} port ${port}`)
})
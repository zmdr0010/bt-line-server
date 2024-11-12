const express = require('express')
const cors = require('cors')
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
router.use(cors())

router.get('/', (req, res) => {
  res.send('str-set')
})

router.post('/add-str', (req, res) => {
  console.log(req.body)
  const uCode = req.body.uCode
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
    res.json(result)
  })
})

router.get('/line-set-list', (req, res) => {
  strSetManager.getLineSetList((result) => {
    res.json(result)
  })
})

router.get('/line-set-list/:memo1', (req, res) => {
  strSetManager.getLineSetListByMemo1((result) => {
    res.json(result)
  }, req.params.memo1)
})

router.get('/line-point-set-list', (req, res) => {
  strSetManager.getLinePointSetList((result) => {
    res.json(result)
  })
})

router.get('/coloring-line-point-set-list', (req, res) => {
  strSetManager.getColoringAndLinePoint((result) => {
    res.json(result)
  })
})

router.get('/coloring-line-set-list', (req, res) => {
  strSetManager.getColoringAndLine((result) => {
    res.json(result)
  })
})

router.get('/place-line-set-list', (req, res) => {
  strSetManager.getPlaceLineSetList((result) => {
    res.json(result)
  })
})

router.get('/line-set/:uCode', (req, res) => {
  const uCode = req.params.uCode
  console.log(uCode)
  strSetManager.getLineSet(uCode, (result) => {
    res.json(result)
  })
})

router.get('/preset-bundle-set-list', (req, res) => {
  strSetManager.getPresetBundleSetList((result) => {
    res.json(result)
  })
})

router.get('/dvc-srt-bundle-set-list', (req, res) => {
  strSetManager.getDvcSrtBundleSetList((result) => {
    res.json(result)
  })
})

router.get('/raw-set-list', (req, res) => {
  strSetManager.getRawSetList((result) => {
    res.json(result)
  })
})

router.get('/edit-p-set-list', (req, res) => {
  strSetManager.getEditPSetList((result) => {
    res.json(result)
  })
})

router.get('/place-edit-p-set-list', (req, res) => {
  strSetManager.getPlaceEditPSetList((result) => {
    res.json(result)
  })
})

router.get('/place-raw-set-list', (req, res) => {
  strSetManager.getPlaceRawSetList((result) => {
    res.json(result)
  })
})

// groups

router.post('/add-group', (req, res) => {
  console.log(req.body)
  const name = req.body.name
  const memo0 = req.body.memo0
  const memo1 = req.body.memo1
  const memo2 = req.body.memo2
  console.log(`add group name: ${name}, memo0: ${memo0}, memo1: ${memo1}, memo2: ${memo2}`)
  strSetManager.addGroup(name, memo0, memo1, memo2, (result) => {
    console.log(result)
    res.json(result)
  })
})

router.get('/group-list', (req, res) => {
  strSetManager.getGroupList((result) => {
    res.json(result)
  })
})

router.post('/add-str-to-group', (req, res) => {
  console.log(req.body)
  const uCode = req.body.uCode
  const groupId = req.body.groupId
  strSetManager.addStrToGroup(uCode, groupId,(result) => {
    console.log(result)
    res.json(result)
  })
})

router.get('/str-list/:groupId', (req, res) => {
  const groupId = req.params.groupId
  strSetManager.getStrListByGroup(groupId, (result) => {
    res.json(result)
  })
})

router.get('/color-set-list', (req, res) => {
  strSetManager.getColorSetList((result) => {
    res.json(result)
  })
})

router.get('/color-palette-list', (req, res) => {
  strSetManager.getColorPaletteList((result) => {
    res.json(result)
  })
})

router.get('/line-edit-list', (req, res) => {
  strSetManager.getLineEditList((result) => {
    res.json(result)
  })
})

router.put('/str-set', (req, res) => {
  console.log(req.body)
  strSetManager.updateStrSet(req.body, (result) => {
    res.json(result)
  })
})

exports.router = router

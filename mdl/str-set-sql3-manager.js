const sqlite3 = require('sqlite3').verbose()
let dbName = ''
let dbPath = ''

// strs table
// str_id (key), ucode (text), str (text), dsg (text), type (text, line/line-point/color ...), memo0, memo1, memo2 (text)
// dsg: designation (str split / -> index item designation)
// type: line, line-coloring, line-coloring-rgb, line-point, line-part(place merge + coloring)
//       coloring, coloring-rgb, place-line, palette, palette-rgb

//// making-line-point / coloring-line-point
////    line-point, coloring(1, black) (memo0: line-point) -> line (memo0: line-point,line-point uCode) <- record origin
//// line coloring
////    line-coloring (memo0: line,line uCode)

// groups table
// group_id (key), name, memo0, memo1, memo2 (text)

// str_groups table
// str_id, group_id

function openDb() {
  let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(err.message)
    }
  })
  return db
}

function init(path, name) {
  dbName = name
  dbPath = `${path}/${dbName}`
  const db = openDb()
  const strsSql = `CREATE TABLE IF NOT EXISTS strs (
                  str_id INTEGER PRIMARY KEY,
                  ucode TEXT NOT NULL UNIQUE,
                  str TEXT NOT NULL,
                  dsg TEXT,
                  type TEXT,
                  memo0 TEXT,
                  memo1 TEXT,
                  memo2 TEXT,
                  created_at TEXT NOT NULL DEFAULT current_timestamp,
                  updated_at TEXT NOT NULL DEFAULT current_timestamp
                )`
  db.run(strsSql)

  const groupsSql = `CREATE TABLE IF NOT EXISTS groups (
                  group_id INTEGER PRIMARY KEY,
                  name TEXT NOT NULL,
                  memo0 TEXT,
                  memo1 TEXT,
                  memo2 TEXT,
                  created_at TEXT NOT NULL DEFAULT current_timestamp,
                  updated_at TEXT NOT NULL DEFAULT current_timestamp
                )`
  db.run(groupsSql)

  const strGroupsSql = `CREATE TABLE IF NOT EXISTS str_groups (
                  str_id INTEGER,
                  group_id INTEGER,
                  PRIMARY KEY (str_id, group_id),
                  FOREIGN KEY (str_id)
                    REFERENCES strs (str_id)
                      ON DELETE CASCADE
                      ON UPDATE NO ACTION,
                  FOREIGN KEY (group_id)
                    REFERENCES groups (group_id)
                      ON DELETE CASCADE
                      ON UPDATE NO ACTION
                )`
  db.run(strGroupsSql)

  // no ; -> error
  const strsTriggerSpl = `CREATE TRIGGER IF NOT EXISTS update_strs_updated_at
                          AFTER UPDATE ON strs
                          WHEN old.updated_at <> current_timestamp
                          BEGIN
                               UPDATE strs
                               SET updated_at = CURRENT_TIMESTAMP
                               WHERE str_id = OLD.str_id;
                          END;
                         `
  db.run(strsTriggerSpl)

  // no ; -> error
  const groupsTriggerSpl = `CREATE TRIGGER IF NOT EXISTS update_groups_updated_at
                          AFTER UPDATE ON groups
                          WHEN old.updated_at <> current_timestamp
                          BEGIN
                               UPDATE groups
                               SET updated_at = CURRENT_TIMESTAMP
                               WHERE group_id = OLD.group_id;
                          END;
                         `
  db.run(groupsTriggerSpl)

  db.close()
}

exports.init = init

function addStr(uCode, str, dsg, type, memo0, memo1, memo2, callback) {
  const db = openDb()
  const checkSql = `SELECT ucode ucode FROM strs WHERE ucode = ?`
  db.get(checkSql, [uCode], (err, row) => {
    if (err) {
      if (callback) callback({ code: 'error', msg: err.message })
      return
    }

    if(row) {
      if (callback) callback({ code: 'exist' })
    } else {
      const addSql = 'INSERT INTO strs (ucode, str, dsg, type, memo0, memo1, memo2) VALUES(?,?,?,?,?,?,?)'
      db.run(addSql, [uCode, str, dsg, type, memo0, memo1, memo2], (err) => {
        if (err) {
          if (callback) callback({ code: 'error', msg: err.message })
          return
        }
        if (callback) callback({ code: 'added' })
      })
    }
  })

  db.close()
}
exports.addStr = addStr

function getLineSetList(callback) {
  const info = {
    params: ['line'],
    where: 'type = ?'
  }
  getStrSetList(info, callback)
}
exports.getLineSetList = getLineSetList

function getLinePointSetList(callback) {
  const info = {
    params: ['line-point'],
    where: 'type = ?'
  }
  getStrSetList(info, callback)
}
exports.getLinePointSetList = getLinePointSetList

function getColoringAndLinePoint(callback) {
  const coloringInfo = {
    params: ['coloring', 'line-point'],
    where: 'type = ? AND memo0 = ?'
  }
  getStrSetList(coloringInfo, (result) => {
    if (result.code === 'list') {
      getLinePointSetList((rst) => {
        if (rst.code === 'list') {
          callback({ code: 'list', pointList: rst.list, colorList: result.list })
        } else {
          callback(rst)
        }
      })
    } else {
      callback(result)
    }
  })

}
exports.getColoringAndLinePoint = getColoringAndLinePoint

function getLineStrSet(uCode, callback) {
  const info = {
    params: [uCode],
    where: 'ucode = ?'
  }
  getStrSet(info, callback)
}
exports.getLineSet = getLineStrSet

function getStrSetList(info, callback) {
  const db = openDb()
  const sql = `SELECT str strSet FROM strs WHERE ${info.where}`
  db.all(sql, info.params, (err, rows) => {
    if (err) {
      if (callback) callback({ code: 'error', msg: err.message })
      return
    }
    const list = []
    rows.forEach(row => {
      list.push(row.strSet)
    })
    if (callback) callback({ code: 'list', list: list })
  })

  db.close()
}

function getStrSet(info, callback) {
  const db = openDb()
  const sql = `SELECT str strSet FROM strs WHERE ${info.where}`
  db.get(sql, info.params, (err, row) => {
    if (err) {
      if (callback) callback({ code: 'error', msg: err.message })
      return
    }
    if (!row) {
      if (callback) callback({ code: 'none', msg: 'have not str' })
      return
    }
    if (callback) callback({ code: 'str', str: row.strSet })
  })

  db.close()
}
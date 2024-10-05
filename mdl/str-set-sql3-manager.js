const sqlite3 = require('sqlite3').verbose()
let dbName = ''
let dbPath = ''

// strs table
// str_id (key), ucode (text), str (text), dsg (text), type (text, line/line-point/color ...), memo0, memo1, memo2 (text)
// dsg: designation (str split / -> index item designation)
// type: line, line-coloring, line-coloring-rgb, line-point,
//       coloring, coloring-rgb, place-line, palette, palette-rgb

//// making-line-point / coloring-line-point
////    line-point, coloring(1, black) -> line (memo0: line-point,line-point uCode) <- record origin
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
                  memo2 TEXT
                )`
  db.run(strsSql)

  const groupsSql = `CREATE TABLE IF NOT EXISTS groups (
                  group_id INTEGER PRIMARY KEY,
                  name TEXT NOT NULL,
                  memo0 TEXT,
                  memo1 TEXT,
                  memo2 TEXT
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
  const db = openDb()
  const sql = `SELECT str strSet FROM strs WHERE type = ?`
  db.all(sql, ['line'], (err, rows) => {
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
exports.getLineSetList = getLineSetList
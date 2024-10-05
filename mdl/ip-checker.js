const os = require("os");

exports.getIp = () => {
  const nets = os.networkInterfaces()
  const result = Object.create(null)

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!result[name]) {
          result[name] = []
        }
        result[name].push(net.address)
      }
    }
  }

  return result["en0"][0]
  //return result["Wi-Fi"][0]//windows
}


var fs = require('fs')

function sendIndex(req,res) {
    var stream = fs.createReadStream(__dirname + '/index.html')
}

module.exports = sendIndex

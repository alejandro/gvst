
var fs = require('fs')

function sendIndex(req,res) {
    var stream = fs.createReadStream(__dirname + '/index.html')

    stream.on('error', function (error){
        res.end(error + '')
    })

    stream.pipe(res).pipe(process.stdout)
}

module.exports = sendIndex

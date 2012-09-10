var js2json = require('js2json')
  , fs = require('fs')
  , src = fs.readFileSync('./questions/easy/questions.js', 'utf8')
  , json = js2json.convert(src)
  


var s = src.replace(/<%=([\s\S]+?)%>/g, function(st, match, ind, left){
    match = match.trim()
    var file = '\nNOT FOUND\n'
    try {
        file = fs.readFileSync('./questions/easy/' + match, 'utf8')
    } catch (ex) {
        console.log('FILE DOESNT EXISTS')
    }

    return '<pre><code>' + file.split('\n').join('\\n') + '</code></pre>'
})

fs.writeFileSync('./questions/easy/index.js', s, 'utf8')

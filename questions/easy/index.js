
var questions = [{
    level: 'easy',
    count: 1,
    id: 1,  
    description: 'Simple questions',
    title: 'Closure and compilers',
    body: "<pre><code>\nvar fs = require('fs')\n\nfunction sendIndex(req,res) {\n    var stream = fs.createReadStream(__dirname + '/index.html')\n\n    stream.on('error', function (error){\n        res.end(error + '')\n    })\n\n    stream.pipe(res).pipe(process.stdout)\n}\n\nmodule.exports = sendIndex\n</code></pre>",
    answers: [{
        text: 'Los',
        value: 100
    },{
        text: 'Los',
        value: 100
    }],
    correct: 2,
    suggestion: ''
},{
    level: 'easy',
    count: 1,
    id: 1,  
    description: 'Simple questions',
    title: 'not a Closure nor a compiler',
    body: "<pre><code>\nvar fs = require('fs')\n\nfunction sendIndex(req,res) {\n    var stream = fs.createReadStream(__dirname + '/index.html')\n}\n\nmodule.exports = sendIndex\n</code></pre>",
    answers: [{
        text: 'Los Alejandros',
        value: 100
    },{
        text: 'Los Morales',
        value: 100
    }],
    correct: 2,
    suggestion: ''
}
]
module.exports = questions
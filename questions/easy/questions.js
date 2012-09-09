
var questions = [{
    level: 'easy',
    count: 1,
    id: 1,  
    description: 'Simple questions',
    title: 'Closure and compilers',
    body: [
    "<pre><code>",
        "var js = function(){",
        "   return new Date()",
        "}",
    "</code></pre>"].join('\n'),
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
    body: [
    "<pre><code>",
        "var j_s = function(){",
        "   return new Date()",
        "}",
    "</code></pre>"].join('\n'),
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

var questions = [{
    level: 'easy',
    count: 1,
    id: 1,  
    description: 'Simple questions',
    title: 'Closure and compilers',
    body: "<%= snippet2.js %>",
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
    body: "<%= snippet1.js %>",
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

var questions = [{
    level: 'easy',
    count: 1,
    id: 1,  
    description: '¿Cual es el resultado de la siguiente expresión?',
    title: 'JavaScript Scope #1',
    body: "<pre data-src=\"prism.js\"><code class=\"language-javascript\">function fn() {\n    alert(x);\n    var x = 10;\n}\n\nfn();</code></pre>",
    answers: [{
        text: 'Alertara "undefined"',
        value: 100
    },{
        text: 'Runtime Error',
        value: 0
    },{
        text: 'Alertara 10',
        value: 0
    }],
    correct: 1,
    suggestion: ''
},{
    level: 'easy',
    count: 1,
    id: 2,  
    description: '¿Cual es el resultado de la siguiente expresión?',
    title: 'JavaScript Scope #2',
    body: "<pre data-src=\"prism.js\"><code class=\"language-javascript\">function fn() {\n    x = 10;\n    alert(x);\n}\nfn();\nalert(x);</code></pre>",
    answers: [{
        text: 'Alertara 10 y luego "undefined"',
        value: 0
    },{
        text: 'Alertara 10 dos veces',
        value: 100
    },{
        text: 'Alertara 10 y luego Runtime Error',
        value: 0

    },{
        text: 'Solo alertara 10',
        value: 0
    }],
    correct: 2,
    suggestion: ''
},{
    level: 'easy',
    count: 1,
    id: 3,  
    description: '¿Cual es el resultado de la siguiente expresión?',
    title: 'JavaScript Scope #3',
    body: "<pre data-src=\"prism.js\"><code class=\"language-javascript\">function fn() {\n    alert(y);\n    y = 10;\n}\nfn();</code></pre>",
    answers: [{
        text: 'Alertara "undefined"',
        value: 0
    },{
        text: 'Runtime Error',
        value: 100
    },{
        text: 'Alertara 99',
        value: 0
    }],
    correct: 2,
    suggestion: ''
},{
    level: 'easy',
    count: 1,
    id: 4,  
    description: '¿Cual es el resultado de la siguiente expresión?',
    title: 'JavaScript Scope #4',
    body: "<pre data-src=\"prism.js\"><code class=\"language-javascript\">function bar() {\n    foo()\n    \n    function foo() {\n        alert(99);\n    }\n}\n\nbar();</code></pre>",
    answers: [{
        text: 'Alertara "undefined"',
        value: 0
    },{
        text: 'Runtime Error',
        value: 100
    },{
        text: 'Alertara 99',
        value: 0
    }],
    correct: 3,
    suggestion: ''
},
{
    level: 'easy',
    count: 1,
    id: 5,  
    description: '¿Cual es el resultado de la siguiente expresión?',
    title: 'JavaScript Scope #4',
    body: "<pre data-src=\"prism.js\"><code class=\"language-javascript\">function foo(){\n    for (var i = 0; i < 5; i++){\n        alert(i);\n    }\n    alert(i);\n}\n\nfoo();</code></pre>",
    answers: [{
        text: 'Alertara 0,1,2,3,4, undefined',
        value: 0
    },{
        text: 'Alertara 0,1,2,3,4,5',
        value: 100
    },{
        text: 'Alertara 0,1,2,3,4, Runtime Error',
        value: 0
    },{
       text: 'Runtime Error',
       value: 0 
    }],
    correct: 2,
    suggestion: ''
},{
    level: 'easy',
    count: 1,
    id: 6,  
    description: '¿Cual es el resultado de la siguiente expresión?',
    title: 'Funciones en JavaScript',
    body: "<pre data-src=\"prism.js\"><code class=\"language-javascript\">function foo(){\n    for (var i = 0; i < 5; i++){\n        alert(i);\n    }\n    alert(i);\n}\n\nfoo();</code></pre>",
    answers: [{
        text: 'Alertara true',
        value: 0
    },{
        text: 'Alertara false',
        value: 100
    }],
    correct: 2,
    suggestion: ''
}
]
module.exports = questions
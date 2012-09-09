
/*
 * GET home page.
 */
var fs = require('fs')
  , questions = {}

exports.index = function(req, res){
  res.render('index', { title: 'JSQuiz' })
}

exports.question = {
    next: function(req, res) {
        if (req.params.id == 'first') req.params.id = 0
        else req.params.id = req.params.id - 1 
        var copy = Object(questions[req.params.level][req.params.id])
        delete copy.correct
        res.json(copy)
    },
    prev: function(req, res){

    }

}

function load() {
    var dir = fs.readdirSync(__dirname + '/../questions')
    dir.forEach(function(folder){
        questions[folder] = require(__dirname + '/../questions/' + folder + '/questions')
    })
}

load()
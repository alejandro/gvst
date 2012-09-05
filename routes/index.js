
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'JSQuiz' });
};
exports.question = {
    next: function(req, res) {
        res.json({
                "title":"Cual es el resultado de:",
                "hints": [],
                "description":"lorem"
            })
    },
    prev: function(req, res){

    }

}
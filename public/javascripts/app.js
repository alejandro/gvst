var Backbone = require('backbone')
      , _ = require('underscore')
     , events = {}//require('events') || {}


function JSQuiz (options) {
    if (!(this instanceof JSQuiz)) return new JSQuiz(options)
    _.extend(this, options)
    this.current = 'Welcome to the world'
    this.parent = this.constructor
    this.questions = []
}


JSQuiz.fn = JSQuiz.prototype


JSQuiz.fn.extend = function (obj) {
    console.log(this)
    return _.extend.call(this, this, obj)
}



JSQuiz.fn.next = function() {
    console.log(this)
    var action = {
        prev : this.current,
        current : this._questions.shift(),
        next: this._questions[0]
    }
    // this.trigger('q:change', action)

    this.emit('q:change', action)
    this.current = action.current
    return this
}

JSQuiz.fn.fetchQuestions = function () {
  var self = this
  var time = +new Date
  $.getJSON('/api/v1/question/first.json', function(question, succeed){
    if (succeed) {
        question = _.isArray(question) ? question : [question]
        self._questions = question.concat(self.questions)
    }
  })
}

JSQuiz.fn.on = function(events, callback, context) {
    var calls, event, node, tail, list;
    if (!callback) return this;
    events = events.split(/\s+/);
    calls = this._callbacks || (this._callbacks = {});


    while (event = events.shift()) {
        list = calls[event];
        node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = {tail: tail, next: list ? list.next : node};
    }

    return this;
}

JSQuiz.fn.emit = function(events) {
    var event, node, calls, tail, args, all, rest;
    if (!(calls = this._callbacks)) return this;
    all = calls.all;
    events = events.split(/\s+/);
    rest = [].slice.call(arguments, 1);
    while (event = events.shift()) {
        if (node = calls[event]) {
          tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, rest);
          }
        }
        if (node = all) {
          tail = node.tail;
          args = [event].concat(rest);
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
    }
    return this;
}
JSQuiz.fn.init = function () {
    this.fetchQuestions()
    // this.startUI()
    // this.setTime()
}


_.each(events, function(value, key){
    JSQuiz.on(key, value)
})

$(document).ready(function(){
    Quiz = new JSQuiz({
        level:'easy',
        time:1000*60*10 // 10 minutes
    })
    Quiz.on('q:change', function(){
        console.log(arguments)
    })
    Quiz.init()
})
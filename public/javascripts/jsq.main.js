
// JSQuiz - Let's build a Quiz
// License: MIT/X11 
// Copyright (c) 2012 Alejandro Morales <vamg008@gmail.com> 

(function () { // -> Silly stuff <-

"use strict";

var Backbone = require('backbone')
  , _ = require('underscore')
  , State = require('state')
  , events = require('events') //|| {}*/
  , tmpls = {
    home:     document.querySelector('#home-tmpl'),
    question: document.querySelector('#question-tmpl'),
    answer:   document.querySelector('#answer-tmpl')
}
  


function JSQuiz(options) {
    if (!(this instanceof JSQuiz)) return new JSQuiz(options)
    _.extend(this, options)
    var self = this
    this.current = 'Bienvenido'
    this.parent = this.constructor // alias all the shit
    this.questions = []
    // Keep our local copy of jQuery to avoid conflict and make it available on other
    // modules
    this.$ = jQuery
    this.$space = this.$('#space')
    this.header = '[Quiz]'
    this.State = new State({})
    this.State.on('change', function (question, id) {
        question = _.isArray(question) ? question : [question]
        self._questions = question
        self.emit('q:render', id)
    })
    window.State = this.State
}


JSQuiz.fn = JSQuiz.prototype = {
    constructor: JSQuiz,

    extend : function (obj) {
        return _.extend.call(this, this, obj)
    },

    next : function () {
        var action = {
            prev : this.current,
            current : this._questions.shift(),
            next: this._questions[0]
        }
        // this.trigger('q:change', action)

        this.emit('q:change', action)
        this.current = action.current
        return this
    },

    fetchQuestions : function (id) {
        if (!id) id = 1
        var self = this, time = +new Date()
          , ep = '/api/v1/' + this.level + '/question/' + id + '.json'
        if (this.State.has(id)){
            return this.State.next(id)
        }
        this.$.getJSON(ep, function (question, succeed) {
            if (!self.ready) {
                self.emit('ready', self.startTime)
            }
            return self.State.next(id, question)
        })
    },
    /*
     Partially Borrowed from Backbone.Events by DocumentCloud
     */
    on : function (events, callback, context) {
        var calls, event, node, tail, list
        if (!callback) return this
        events = events.split(/\s+/)
        calls = this._callbacks || (this._callbacks = {})


        while (event = events.shift()) {
            list = calls[event]
            node = list ? list.tail : {}
            node.next = tail = {}
            node.context = context
            node.callback = callback
            calls[event] = {tail: tail, next: list ? list.next : node}
        }

        return this
    },

    /*
     Partially Borrowed from Backbone.Events by DocumentCloud,
    "emit" and  "on" add the ability to "trigger" events
     */

    emit : function (events) {
        var event, node, calls, tail, args, all, rest
        if (!(calls = this._callbacks)) return this
        all = calls.all
        events = events.split(/\s+/)
        rest = [].slice.call(arguments, 1)
        while (event = events.shift()) {
            if (node = calls[event]) {
                tail = node.tail

                while ((node = node.next) !== tail) {
                    node.callback.apply(node.context || this, rest)
                 }
            }
            if (node = all) {
                tail = node.tail
                args = [event].concat(rest)
                while ((node = node.next) !== tail) {
                    node.callback.apply(node.context || this, args)
                }
            }
        }
        return this
    },

    init : function () {
        var self = this
        this.fetchQuestions()
        _.each(events, function (value, key){
            self.on(key, value.bind(self))
        }, this)
        this.startTime = +new Date
        return this
        // this.startUI()
        // this.setTime()
    },

    /*
      Ember stack trace detection
      */
    log: function () {
        if (!this.verbose) return
        // Simulate stacks! 
        var error, stack, stackStr
        try { __fail__.fail() } catch (e) { error = e }
        if (error.stack) {
            var stack;

            if (error['arguments']) {
              stack = error.stack.replace(/^\s+at\s+/gm, '').
                                  replace(/^([^\(]+?)([\n$])/gm, '{anonymous}($1)$2').
                                  replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}($1)').split('\n')
              stack.shift()
            } else {
              stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').
                                  replace(/^\(/gm, '{anonymous}(').split('\n')
            }

            stackStr = "\n    " + stack.slice(2).join("\n    ")
          }
        console.log([this.header].concat([].slice.call(arguments)).join(' '))
        console.info('\t' + stack.slice(1,2))
    }
}



$(document).ready(function (){
    // var 
    var Quiz = new JSQuiz({
        level:'easy',
        time: 1000*60*10, // 10 minutes
        verbose: true
    })

    Quiz.on('ready', function (a){
        Quiz.log('Started at ' + new Date(a))
    }).init()
})

}).call(this)

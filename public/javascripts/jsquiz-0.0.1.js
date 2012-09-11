/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>
<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */
!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(name, definition)
  else if (this.provide) this.provide(name, definition())
  else this[name] = definition()
}('state', function () {

    function State (options) {
        var s = this;
        this.options = options
        s.cache = {}
    }

    State.fn = State.prototype = Object.create(Array.prototype, {
        constructor: { 
            value: State,
            enumerable: false
        }
    })

    State.prototype._push = Object(State.prototype.push)

    State.prototype.push = function (id, thing) {
        var s = this
        if (this.length >= this.maxSize) throw new Error('MaxSize reached')
        if (typeof(id) !== 'string' && typeof(id) !== 'number') {
            throw new TypeError('(id) must be alphanumeric')
        }
        
        if (this.cache[id] && arguments.length == 1) {
            if (this.indexOf(id) === -1) {
                return this._push(id)    
            } else {
                return this.get(id)
            }
            
        } else if (arguments.length > 2) {
            [].slice.call(arguments).forEach(function(item){
                if (s.indexOf(item) == -1) {
                    return s._push(item)
                }
            })
        }
        
        if (arguments.length <= 1) {
            throw new TypeError('I need two params, yo!')
        }
        if (!this.cache[id] && !this[id]) {
            this.cache[id] = thing
            this._push(id)
            return this
        } else {
            return 'Already on the kue'
        }
        
    }

    State.prototype.set = function(id, thing) {
        if (!this.cache[id]) return new TypeError('(id) is not in the list')
        this.cache[id] = thing
        return this
    }

    State.prototype.next = function (id, wat) {
        var next, bk
        if (this.cache[id]) {
            next = id
        } else if (wat) {
            this.cache[id] = wat
            next = id
        } else {
            next  = this.shift()
        }
        this.push(next)
        this.emit('change', this.cache[next], next)
        return this.cache[next]
    }

    State.prototype.set  = function (id, wat){
        if (this.cache[id] && wat) {
            return this.cache[id] = wat
        } else {
            throw new Error('(id) is not in the kue, use push instead')
        }
    }

    State.prototype.get = function (id) {
        return this.cache[id] || {}
    }


    State.prototype.prev = function(id, wat){
        var prev, bk
        if (this.cache[id]) {
            prev = id 
        } else if (wat){
            this.cache[id] = wat
            prev = id
        } else {
            prev = this.pop()
        }
        bk = this.splice(0)
        var newa = [prev].concat(bk)
        if (bk.indexOf(prev) > -1) {
            newa = bk
        }
        this.push.apply(this, newa)
        this.emit('change', this.cache[prev], prev)
        return this.cache[prev]
    }

    // TODO
    State.prototype.has = function (id) {
        return this.cache[id] !== undefined
    }


    State.prototype.on = function(events, callback, context) {
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

    State.prototype.emit = function(events) {
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

    Object.defineProperties(State.prototype, {
        'maxSize': {
            get: function () { 
                return this.options.maxSize || Infinity
            }
        },
        'interval': {
            get: function () {
                return this.options.interval || 1
            }
        },
        'all':{
            get: function (){
                return this.cache            
            }
        }
    })

    return State
})
!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(name, definition)
  else if (this.provide) this.provide(name, definition())
  else this[name] = definition()
}('events', function () {
    var _ = require('underscore')
      , State = require('state')

    function qchange(msg) {
        this.log('Has Changed')
    }

    function qanswer(answ) {

    }

    function btnsend(ev) {
        ev.preventDefault()
        var api = '/api/v1/' +  this.level + '/answers', s = this
    
        return this.$.post(api, this.State.all, function(res){
            return s.emit('ui:done', res)
        })
    }
    function done(resp) {
        alert(JSON.stringify(resp))
    }

    function qnew(prev) {

    }
    function btnprev() {
        event.preventDefault()
        var data = this.active.dataset
          , prev = data.next - 2
        if (prev <= 0) prev = 1
        fixAnswers.call(this, data.sid)
        this.State.prev(prev)
    }

    function fixAnswers (sid){
        var current = this.State.get(sid)
           , answer = this.$('#question [name="answers"]:checked').next()
        if (answer.data() !== null) {
            var id = answer.data().id
            current.answer = id
            current.answers.map(function(item){
                item.checked = false
                return item
            })
            current.answers[id].checked = true
        }
        this.State.set(sid, current)
        return current
    }
    function btnnext(event) {
        event.preventDefault()
        var target = event.target
          , data = this.active.dataset
        this.qnext = data.next
        fixAnswers.call(this, data.sid)
        this.fetchQuestions(data.next)
    }

    function qrender(id) {
        var s = this
        s._questions[0].sid = id || 0
        if (!s._questions[0].id) return
        s.$space.html(s.qtemplate(s._questions[0]))
        s.active = s.$('#question')[0]
        s.$('#prev').bind('click', s.emit.bind(s, 'ui:button:prev'));
        s.$('#send').bind('click', s.emit.bind(s, 'ui:button:send'));
        s.$('#next').bind('click', s.emit.bind(s, 'ui:button:next'));
        if (window.Prism) {
            Prism.highlightAll()
        }
    }

    function ready(time) {
        this.ready = true
        this.qtemplate = _.template(document.querySelector('#question-tmpl').text)
        // this.State.init()
    }

    return {
        'ready': ready,
        'q:render': qrender,
        'q:change': qchange,
        'q:answer': qanswer,
        'q:new': qnew,
        'ui:button:prev': btnprev,
        'ui:button:next': btnnext,
        'ui:button:send': btnsend,
        'ui:done': done
    }

})

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

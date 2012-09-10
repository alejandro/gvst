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
           , answer = this.$('#question [name="answers"]:checked').prev()
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
        s.$space.html(s.qtemplate(s._questions[0]))
        s.active = s.$('#question')[0]
        s.$('#prev').bind('click', s.emit.bind(s, 'ui:button:prev'));
        s.$('#send').bind('click', s.emit.bind(s, 'ui:button:send'));
        s.$('#next').bind('click', s.emit.bind(s, 'ui:button:next'));
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
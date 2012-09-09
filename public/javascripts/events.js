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

    function qsend(question) {

    }

    function qnew(prev) {

    }
    function btnprev() {
        event.preventDefault()
        this.State.prev()
    }
    function btnnext(event) {
        event.preventDefault()
        var target = event.target
          , next = this.active.dataset.next
        this.qnext = next
        this.fetchQuestions(next)
    }

    function qrender() {
        var s = this
        s.$space.html(s.qtemplate(s._questions[0]))
        s.active = s.$('#question')[0]
        s.$('#prev').bind('click', s.emit.bind(s, 'ui:button:prev'));
        s.$('#next').bind('click', s.emit.bind(s, 'ui:button:next'));
    }

    function ready(time) {
        this.ready = true
        this.qtemplate = _.template(document.querySelector('#question-tmpl').text)
        this.State.init()
    }

    return {
        'ready': ready,
        'q:render': qrender,
        'q:change': qchange,
        'q:answer': qanswer,
        'q:send': qsend,
        'q:new': qnew,
        'ui:button:prev': btnprev,
        'ui:button:next': btnnext,
    }

})
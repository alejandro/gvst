!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(name, definition)
  else this[name] = definition()
}('events', function () {
    function qchange (msg) {

    }

    function qanswer (answ) {

    }

    function qsend (question) {

    }

    function qnew (prev) {

    }

    return {
        'q:change': qchange,
        'q:answer': qanswer,
        'q:send': qsend,
        'q:new': qnew
    }

})
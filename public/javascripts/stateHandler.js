// This is a simple state handler
// Allows you to loop through an array of actions. E.g: History API
// so you can share state between a carrousel of "views","states", "values"

// E.g

/* var ViewHandler = new State({maxSize: 100}) 

 ViewHandler.push({
    title: 'Sidebar Title',
    html: $('.sidebar').html()
    id: 'random-id-ids'
 })

  ViewHandler.push({
    title: 'About us',
    html: $('.about').html()
    id: 'random-id-ids'
 })
 ...


 ViewHandler.on('change', function(ev){
    $('.current').html(ev.html)
 })

 ViewHandler.init()

 History.on('pushState', function(){
    // This is not a history api, just an e.g

    // asuming is a next
    return ViewHandler.next()
 })
 
 ViewHandler.next({
    title: 'Conctact us',
    html: $('.contact').html()
    id: 'contact-id-ids'
 })

 // .current now has the html from .contact

*/


function State (opts) {
    this.maxSize = opts.maxSize || 40 // Default to 40 states
    this.interval = opts.interval || 1
    this.range = {
        prev: [],
        next: []
    }
}


State.prototype = Object.create(Array.prototype)

State.prototype._push = Array.prototype.push

State.prototype.push = function () {
    if (this.length > this.maxSize) throw new TypeError('MaxSize limit reached')
    this._push.apply(this, [].slice.call(arguments))
}

State.prototype.next = function (wat){
    if (this.range.current) {
        this.range.prev.push(this.range.current)
    }
    var next = wat
    if (!next && this.length) {
        next = this.shift()
    } else if (wat) { 
        this.push(wat)
    } else {
        throw new Error('End of stack reached')
    }
    this.range.next = this.slice(0)
    this.current = next
    this.range.current = next
    // Somehow this is breaking the app
    // this.next = this.range.next[0]
    // this.prev = this.range.prev.slice(-1)
    this.emit('change', this.current)
    return this.current
}

State.prototype.prev = 
State.prototype.previous = function (wat) {
    if (this.range.current) {
        this.range.next.push(this.range.current)
    }
    var prev = wat
    if (!prev && this.range.prev.length) {
        prev = this.range.prev.pop()
    } else if (wat) { 
        this.range.prev.push(wat)
    } else {
        throw new Error('Begin of stack reached')
    }
    this.current = prev
    this.range.current = prev
    this.emit('change', this.current)
    return this.current
}

State.prototype.init = function () {
    return this.next()
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


/* TEST*/

// var st = new State({maxSize:5, interval:1})

// st.push('first try')
// st.push('second try')
// st.push({
//     title:'Named arg',
//     prev: 'asda'
// })

// st.push([{
//     title: 'ionded'
// }])
// st.push(+new Date)

// st.on('change', function(current){
//     console.log(current)
// })
// st.next()
// // console.log(st.range)
// st.next()
// // console.log(st.range)
// st.next()
// // console.log(st.range)
// st.next()
// // console.log(st.range)
// st.next()
// console.log(st.range)
// st.prev()
// console.log(st.range)
// st.prev()
// console.log(st.range)
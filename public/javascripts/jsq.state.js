!function (name, definition) {
  if (this.provide) this.provide(name, definition())
  else this[name] = definition()
}('state', function () {

    function State (options) {
        var s = this;
        s.__defineGetter__('maxSize', function (){
            return options.maxSize || Infinity
        })
        s.__defineGetter__('interval', function () {
            return options.interval || 1
        })

        s.__defineGetter__('range', function(){
            return this._range || {}
        })
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
        this.emit('change', this.cache[next])
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
        if (bk.indexOf(prev)) {
            newa = bk
        }
        this.push.apply(this, newa)
        this.emit('change', this.cache[prev])
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

    return State
})
var State = require('./jsq.state')
  , assert = require('assert')

var localState = new State({maxSize: 100})


assert(localState.maxSize, 100, 'maxSize should be 100')
assert(localState.interval, 1, 'interval should be 1 (default)')

localState.on('change', function(current){
    assert(current)
})
var ids = []

var i = 0
for (;i < 10; i++) {
    ids.push(Math.floor(Math.random() * Math.random()  * 100e10))
}

var dmata = {
    0: [1],
    1: {a:1,b:2},
    2: +new Date,
    3: 'Alejandro Morales',
    4: [1,{ a: 2, c: { 1: 2 }}],
    5: new Date,
    6: new Array(100),
    7: new Buffer('<$AS<'),
    8: 1234512312312,
    9: 2131241241243 + 'asd',
    10: 'Prueba nuevo'
}


ids.forEach(function(id,ind){
    localState.push(id, dmata[ind])
})

assert.equal(localState.length, 10, 'It must have 10 ids')
assert.deepEqual(localState.next(), dmata[0], 'it must start with the very begin')
assert.equal(localState.length, 10, 'it must be the same length')
assert.equal(localState.next(10, dmata[10]), dmata[10], 'it must accept new element')
assert.equal(localState.length, 11, 'it must be a new element')
assert.equal(localState.prev(), dmata[10], 'the prev must be the same as the last element pushed')

var fil = localState.filter(function(el, ind){    
    return localState.cache[el] !== dmata[ind]
})

assert.equal(localState.get(10), dmata[10], 'get should just work')
assert.equal(localState.set(10, 'No Prueba'), localState.get(10), 'set should work')

assert.equal(fil.length, 2, 'the first and the last are not switched')
assert(localState instanceof Array) // Check prototype
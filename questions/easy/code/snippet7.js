function Foo() {
    var bestBand = 'JIFSNIF';
    this.js = function() {
        alert(bestBand);
    };
}

var f1 = new Foo();
var f2 = new Foo();
alert(f1.js === f2.js);
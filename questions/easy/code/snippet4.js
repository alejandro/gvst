function bar() {
    foo();
    
    var foo = function() {
        alert(99);
    };
}

bar();
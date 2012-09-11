function bar() {
    foo()
    
    function foo() {
        alert(99);
    }
}

bar();
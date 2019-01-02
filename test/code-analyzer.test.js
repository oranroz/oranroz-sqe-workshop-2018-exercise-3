import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {initCounter,initTable} from '../src/js/part2';
import {inputVariable} from '../src/js/part2';
import {start} from '../src/js/part2';
import {validationCode} from '../src/js/part2';
import {initMapV,getColorMap} from '../src/js/part2';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });
    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });

    it('is parsing a update expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('i++')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"UpdateExpression","operator":"++","argument":{"type":"Identifier","name":"i"},"prefix":false}}],"sourceType":"script"}'
        );
    });

    it('is parsing a update expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('++i')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"UpdateExpression","operator":"++","argument":{"type":"Identifier","name":"i"},"prefix":true}}],"sourceType":"script"}'
        );
    });


    it('is parsing a returnStatement and function declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function check(i){return i;}')),
            '{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"check"},"params":[{"type":"Identifier","name":"i"}],"body":{"type":"BlockStatement","body":[{"type":"ReturnStatement","argument":{"type":"Identifier","name":"i"}}]},"generator":false,"expression":false,"async":false}],"sourceType":"script"}'
        );
    });


    it('is parsing a member expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('table[0] = 1;')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"table"},"property":{"type":"Literal","value":0,"raw":"0"}},"right":{"type":"Literal","value":1,"raw":"1"}}}],"sourceType":"script"}'
        );
    });

    it('is parsing a member expression and indentifier and literal correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('temp = table[0]')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"temp"},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"table"},"property":{"type":"Literal","value":0,"raw":"0"}}}}],"sourceType":"script"}'
        );
    });

    it('is parsing a binary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('temp = (x+y)*2')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"temp"},"right":{"type":"BinaryExpression","operator":"*","left":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"x"},"right":{"type":"Identifier","name":"y"}},"right":{"type":"Literal","value":2,"raw":"2"}}}}],"sourceType":"script"}'
        );
    });

    it('is parsing a binary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('temp = (x*y) + a[3];')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"temp"},"right":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"*","left":{"type":"Identifier","name":"x"},"right":{"type":"Identifier","name":"y"}},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"a"},"property":{"type":"Literal","value":3,"raw":"3"}}}}}],"sourceType":"script"}'
        );
    });

    it('is parsing a binary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('x = x +2;')),
            '{"type":"Program","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"x"},"right":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"x"},"right":{"type":"Literal","value":2,"raw":"2"}}}}],"sourceType":"script"}'
        );
    });

    it('is parsing a while statement + binary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('while(x<y){x=a[0]+1;}')),
            '{"type":"Program","body":[{"type":"WhileStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Identifier","name":"x"},"right":{"type":"Identifier","name":"y"}},"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"x"},"right":{"type":"BinaryExpression","operator":"+","left":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"a"},"property":{"type":"Literal","value":0,"raw":"0"}},"right":{"type":"Literal","value":1,"raw":"1"}}}}]}}],"sourceType":"script"}'
        );
    });

    it('is parsing an for statement + vriable declartion correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('for(let i=0;i<10;i++){var che = (i*2);}')),
            '{"type":"Program","body":[{"type":"ForStatement","init":{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"i"},"init":{"type":"Literal","value":0,"raw":"0"}}],"kind":"let"},"test":{"type":"BinaryExpression","operator":"<","left":{"type":"Identifier","name":"i"},"right":{"type":"Literal","value":10,"raw":"10"}},"update":{"type":"UpdateExpression","operator":"++","argument":{"type":"Identifier","name":"i"},"prefix":false},"body":{"type":"BlockStatement","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"che"},"init":{"type":"BinaryExpression","operator":"*","left":{"type":"Identifier","name":"i"},"right":{"type":"Literal","value":2,"raw":"2"}}}],"kind":"var"}]}}],"sourceType":"script"}'
        );
    });


    it('is parsing an if statement + unary correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if(l>10){i = -1}')),
            '{"type":"Program","body":[{"type":"IfStatement","test":{"type":"BinaryExpression","operator":">","left":{"type":"Identifier","name":"l"},"right":{"type":"Literal","value":10,"raw":"10"}},"consequent":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"i"},"right":{"type":"UnaryExpression","operator":"-","argument":{"type":"Literal","value":1,"raw":"1"},"prefix":true}}}]},"alternate":null}],"sourceType":"script"}'
        );
    });
    //////work 2
    it('1 check function with string input and size of ', () => {
        var input='function foo (x,y){\n' +
            'let c = \'oran\';\n' +
            'let b = x;\n' +
            'if(x === b){\n' +
            'return 1;\n' +
            '}else{\n' +
            'return 0;\n' +
            '}\n' +
            '}';
        initTable();
        initCounter();
        var parsedCode=parseCode(input);
        initMapV();
        inputVariable('x=\'nir\',y=\'rin\'');
        start(parsedCode);
        let finalCode = validationCode(input);
        var result='if(x === (x)){';
        assert.equal(finalCode[1],result);
    });

    it('2 check function with int input and size of and map colors ', () => {
        var input='function foo (x,y,z){\n' +
            'let a = x + 1;\n' +
            'let b = y;\n' +
            'if(a<b){\n' +
            'return 1;\n' +
            '}else{\n' +
            'return 0;\n' +
            '}\n' +
            '}';
        initTable();
        initCounter();
        var parsedCode=parseCode(input);
        initMapV();
        inputVariable('x=10,y=1,z=2');
        start(parsedCode);
        let finalCode = validationCode(input);
        let MapC = getColorMap();
        var result='function foo (x,y,z){';
        assert.equal(finalCode[0],result);
        assert.equal(finalCode.length,7);
        assert.equal(MapC[0],false);
    });

    it('3 check function with int input and multi-if ', () => {
        var input='function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}'
        initTable();
        initCounter();
        var parsedCode=parseCode(input);
        initMapV();
        inputVariable('x=10,y=1,z=2');
        start(parsedCode);
        let finalCode = validationCode(input);
        var result='    if (((x+1)+y) < z) {';
        var result1='        return x + y + z + ((0)+z+5);';
        assert.equal(finalCode[2],result);
        assert.equal(finalCode[7],result1);
    });


    it('4 check function with array input and map colors ', () => {
        var input='function foo(x, y, z){\n' +
            '    let a = x[0] + 1;\n' +
            '    let b = \'hate\';\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b === x[2]) {\n' +
            '        return b;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x[2];\n' +
            '    }\n' +
            '}\n'
        initTable();
        initCounter();
        var parsedCode=parseCode(input);
        initMapV();
        inputVariable('x=[1,2,\'love\'],y=1,z=10');
        start(parsedCode);
        let finalCode = validationCode(input);
        let MapC = getColorMap();
        var result='    if ((hate) === x[2]) {';
        var result1='        return (hate);';
        assert.equal(finalCode[2],result);
        assert.equal(finalCode[3],result1);
        assert.equal(MapC[1],true);
    });

    it('5 check function with global dec', () => {
        var input='let f = 1;\n' +
            'function foo(x, y){\n' +
            '    let a = f + 1;\n' +
            '    let b = x + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b > a) {\n' +
            '        return b;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x;\n' +
            '    }\n' +
            '}\n';
        initTable();
        initCounter();
        var parsedCode=parseCode(input);
        initMapV();
        inputVariable('x=3,y=1');
        start(parsedCode);
        let finalCode = validationCode(input);
        let MapC = getColorMap();
        var result='        return (x+y);';
        var result1='    if ((x+y) > ((1)+1)) {';
        assert.equal(finalCode[4],result);
        assert.equal(finalCode[3],result1);
        assert.equal(MapC[1],false);
    });

    it('6 check function with global expression dec', () => {
        var input='f = 1;\n' +
            'function foo(x, y){\n' +
            '    let a = f + 1;\n' +
            '    let b = x + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b > a) {\n' +
            '        return b;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x;\n' +
            '    }\n' +
            '}\n';
        initTable();
        initCounter();
        var parsedCode=parseCode(input);
        initMapV();
        inputVariable('x=3,y=1');
        start(parsedCode);
        let finalCode = validationCode(input);
        let MapC = getColorMap();
        var result='        return (x+y);';
        var result1='    if ((x+y) > ((1)+1)) {';
        assert.equal(finalCode[4],result);
        assert.equal(finalCode[3],result1);
        assert.equal(MapC[1],false);
    });

    it('7 check function with global expression dec', () => {
        var input='let f;\n' +
            'function foo(x, y){\n' +
            '    let a = f + 1;\n' +
            '    let b = x + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b > a) {\n' +
            '        return b;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x;\n' +
            '    }\n' +
            '}\n';
        initTable();
        initCounter();
        var parsedCode=parseCode(input);
        initMapV();
        inputVariable('f=1,x=3,y=1');
        start(parsedCode);
        let finalCode = validationCode(input);
        let MapC = getColorMap();
        var result='        return (x+y);';
        var result1='    if ((x+y) > (1+1)) {';
        assert.equal(finalCode[4],result);
        assert.equal(finalCode[3],result1);
        assert.equal(MapC[1],false);
    });

    it('8 check Map of colors in a function with if in if', () => {
        var input='function foo(x, y,f){\n' +
            '    let a = f + 1;\n' +
            '    let b = x + y;\n' +
            '    let c = f + x;\n' +
            'if(a<b)\n' +
            '{\n' +
            'if(b<c){\n' +
            'return 0\n' +
            '}\n' +
            'else{\n' +
            'return 1;\n' +
            '}\n' +
            '}else if(a<c){\n' +
            'return 2;\n' +
            '}else{\n' +
            'return 3;\n' +
            '}\n' +
            '\n' +
            '}';
        initTable();
        initCounter();
        var parsedCode=parseCode(input);
        initMapV();
        inputVariable('f=1,x=3,y=4');
        start(parsedCode);
        let finalCode = validationCode(input);
        let MapC = getColorMap();
        assert.equal(MapC[0],true);
        assert.equal(MapC[1],false);
        assert.equal(MapC[2],true);
        assert.equal(MapC[3],true);
        assert.equal(MapC[4],false);
    });

    it('9 check function with global expression and variable dec and array', () => {
        var input='let f=x[1];\n' +
            'let w = \'or\'\n' +
            'w = f*1\n' +
            'function foo(x, y){\n' +
            '   if(w < y){\n' +
            'return true;\n' +
            '}else{\n' +
            'return false\n' +
            '\n' +
            '}\n' +
            '}\n';
        initTable();
        initCounter();
        var parsedCode=parseCode(input);
        initMapV();
        inputVariable('x=[1,3],y=4');
        start(parsedCode);
        let finalCode = validationCode(input);
        let MapC = getColorMap();
        var result='   if(((x[1])*1) < y){';
        var result1='let f=x[1];';
        assert.equal(finalCode[4],result);
        assert.equal(finalCode[0],result1);
        assert.equal(MapC[0],true);
    });

    it('10 check function with && in the if', () => {
        var input='function foo(x,y,z,a)\n' +
            '{\n' +
            'if(x>y && z>a)\n' +
            '{\n' +
            'return a;\n' +
            '}else{\n' +
            'return x\n' +
            '}\n' +
            '}';
        initTable();
        initCounter();
        var parsedCode=parseCode(input);
        initMapV();
        inputVariable('x=12,y=1,z=3,a=2');
        start(parsedCode);
        let finalCode = validationCode(input);
        let MapC = getColorMap();
        var result='if(x>y && z>a)';
        assert.equal(finalCode[2],result);
        assert.equal(MapC[0],true);
    });

    it('11 check function with while and one if', () => {
        var input='function foo(x,y){\n' +
            'while(x<y){\n' +
            'if(x == 2)\n' +
            '{\n' +
            'return 1;\n' +
            '}\n' +
            '}\n' +
            '}';
        initTable();
        initCounter();
        var parsedCode=parseCode(input);
        initMapV();
        inputVariable('x=2,y=1');
        start(parsedCode);
        let finalCode = validationCode(input);
        let MapC = getColorMap();
        var result='while(x<y){';
        assert.equal(finalCode[1],result);
        assert.equal(MapC[0],true);
    });
});

it('12 check function with || in the if', () => {
    var input='function foo(x,y){\n' +
        'if(x == 2 || y ==2)\n' +
        '{\n' +
        'return 1;\n' +
        '}\n' +
        '}\n';
    initTable();
    initCounter();
    var parsedCode=parseCode(input);
    initMapV();
    inputVariable('x=2,y=1');
    start(parsedCode);
    let finalCode = validationCode(input);
    let MapC = getColorMap();
    var result='if(x == 2 || y ==2)';
    assert.equal(finalCode[1],result);
    assert.equal(MapC[0],true);
});
import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {initCounter,initTable} from '../src/js/part2';
import {inputVariable} from '../src/js/part2';
import {start} from '../src/js/part2';
import {getColorMap} from '../src/js/part2';
import {validationCode} from '../src/js/part2';
import {initMapV,initNode, getArrNode} from '../src/js/part2';
import {buildNodesGraph,initStrGraph,buildEdgesGraph,getStrGraph,addEdgeBtwnCircle} from '../src/js/graph';
import * as gra from '../src/js/graph';
import * as sym from '../src/js/part2';

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
        var input = 'function foo (x,y){\n' +
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
        var parsedCode = parseCode(input);
        initMapV();
        inputVariable('x=\'nir\',y=\'rin\'');
        start(parsedCode);
        let finalCode = validationCode(input);
        var result = 'if(x === (x)){';
        assert.equal(finalCode[1], result);
    });
    ////work3
    it('1 check function if else-if and else ', () => {
        var input = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        initCounter();
        initTable();
        initNode();
        initMapV();
        inputVariable('x=1,y=2,z=3');
        var parsedCode = parseCode(input);
        start(parsedCode);
        let arrNode = sym.getArrNode();
        gra.initStrGraph();
        gra.buildNodesGraph(arrNode[0]);
        gra.buildEdgesGraph(arrNode[0]);
        gra.addEdgeBtwnCircle();
        let strGraph = gra.getStrGraph();
        let arrGraph = strGraph.split(/\r?\n/);
        var result = 'kod5(no,right)->kod6';
        var result1 ='kod8=>operation: c = c + x + 5';
        assert.equal(arrGraph[19], result);
        assert.equal(arrGraph[8], result1);
    });
    it('2 check function with while', () => {
        var input = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n';
        initCounter();
        initTable();
        initNode();
        initMapV();
        inputVariable('x=1,y=2,z=3');
        var parsedCode = parseCode(input);
        start(parsedCode);
        let arrNode = sym.getArrNode();
        gra.initStrGraph();
        gra.buildNodesGraph(arrNode[0]);
        gra.buildEdgesGraph(arrNode[0]);
        gra.addEdgeBtwnCircle();
        let strGraph = gra.getStrGraph();
        let arrGraph = strGraph.split(/\r?\n/);
        var result = 'kod5=>condition: while (a < z)';
        var result1 ='kod5(yes)->kod6';
        assert.equal(arrGraph[4], result);
        assert.equal(arrGraph[13], result1);
    });

    it('3 check function with if inside a while', () => {
        var input = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let c = 0;\n' +
            '   while (a < z) {\n' +
            '       if(a > 1){\n' +
            '          a = a + 1;\n' +
            '       }else{\n' +
            '         c = c + 1;\n' +
            '       }\n' +
            '   }\n' +
            '   return z;\n' +
            '}\n';
        initCounter();
        initTable();
        initNode();
        initMapV();
        inputVariable('x=1,y=2,z=3');
        var parsedCode = parseCode(input);
        start(parsedCode);
        let arrNode = sym.getArrNode();
        gra.initStrGraph();
        gra.buildNodesGraph(arrNode[0]);
        gra.buildEdgesGraph(arrNode[0]);
        gra.addEdgeBtwnCircle();
        let strGraph = gra.getStrGraph();
        let arrGraph = strGraph.split(/\r?\n/);
        var result = 'kod4(no,right)->kod8';
        var result1 ='kod30=>start: |green';
        assert.equal(arrGraph[16], result);
        assert.equal(arrGraph[9], result1);
    });

    it('3 check function with while inside an if', () => {
        var input = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let c = 0;\n' +
            ' \n' +
            '       if(a > 1){\n' +
            '  while (a < z) {\n' +
            'a=a+1;\n' +
            '}\n' +
            '       }else{\n' +
            '         c = c + 1;\n' +
            '       }\n' +
            '   return z;\n' +
            '}\n';
        initCounter();
        initTable();
        initNode();
        initMapV();
        inputVariable('x=1,y=2,z=3');
        var parsedCode = parseCode(input);
        start(parsedCode);
        let arrNode = sym.getArrNode();
        gra.initStrGraph();
        gra.buildNodesGraph(arrNode[0]);
        gra.buildEdgesGraph(arrNode[0]);
        gra.addEdgeBtwnCircle();
        let strGraph = gra.getStrGraph();
        let arrGraph = strGraph.split(/\r?\n/);
        var result = 'kod5(no,right)->kod30';
        var result1 ='kod8=>operation: return z';
        assert.equal(arrGraph[19], result);
        assert.equal(arrGraph[10], result1);
    });

    it('4 check function with lonley if', () => {
        var input = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let c = 0;\n' +
            '       if(a > 1){\n' +
            'a=a-1;\n' +
            '}\n' +
            '   return z;\n' +
            '}\n';
        initCounter();
        initTable();
        initNode();
        initMapV();
        inputVariable('x=1,y=2,z=3');
        var parsedCode = parseCode(input);
        start(parsedCode);
        let arrNode = sym.getArrNode();
        gra.initStrGraph();
        gra.buildNodesGraph(arrNode[0]);
        gra.buildEdgesGraph(arrNode[0]);
        gra.addEdgeBtwnCircle();
        let strGraph = gra.getStrGraph();
        let arrGraph = strGraph.split(/\r?\n/);
        var result = 'kod30=>start: |green';
        var result1 ='kod1->kod4';
        assert.equal(arrGraph[7], result);
        assert.equal(arrGraph[10], result1);
    });

    it('5 check function with if in if', () => {
        var input = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let c = 0;\n' +
            '       if(a > 1){\n' +
            'if(c==0){\n' +
            'c=c+1;\n' +
            '}else{\n' +
            'c=0;\n' +
            '}\n' +
            '}else{\n' +
            'a=a-1;\n' +
            '}\n' +
            '   return z;\n' +
            '}\n';
        initCounter();
        initTable();
        initNode();
        initMapV();
        inputVariable('x=1,y=2,z=3');
        var parsedCode = parseCode(input);
        start(parsedCode);
        let arrNode = sym.getArrNode();
        gra.initStrGraph();
        gra.buildNodesGraph(arrNode[0]);
        gra.buildEdgesGraph(arrNode[0]);
        gra.addEdgeBtwnCircle();
        let strGraph = gra.getStrGraph();
        let arrGraph = strGraph.split(/\r?\n/);
        var result = 'kod31->kod30';
        var result1 ='kod4(no,right)->kod8';
        assert.equal(arrGraph[28], result);
        assert.equal(arrGraph[19], result1);
    });

    it('6 check function with if and while separate', () => {
        var input = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   while(a>x){\n' +
            'a=a-1;\n' +
            '}\n' +
            'if(a>0){\n' +
            'z=z+2;\n' +
            '}else{\n' +
            'z = 5;\n' +
            '}\n' +
            '   return z;\n' +
            '}\n';
        initCounter();
        initTable();
        initNode();
        initMapV();
        inputVariable('x=1,y=2,z=3');
        var parsedCode = parseCode(input);
        start(parsedCode);
        let arrNode = sym.getArrNode();
        gra.initStrGraph();
        gra.buildNodesGraph(arrNode[0]);
        gra.buildEdgesGraph(arrNode[0]);
        gra.addEdgeBtwnCircle();
        let strGraph = gra.getStrGraph();
        let arrGraph = strGraph.split(/\r?\n/);
        var result = 'kod3(no,right)->kod5';
        var result1 ='kod8=>operation: return z';
        var result2 = '|green';
        assert.equal(arrGraph[17], result);
        assert.equal(arrGraph[11], result1);
        assert.equal(arrGraph[12], result2);
    });

    it('7 check function with varDec and Return only', () => {
        var input = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   return z;\n' +
            '}\n';
        initCounter();
        initTable();
        initNode();
        initMapV();
        inputVariable('x=1,y=2,z=3');
        var parsedCode = parseCode(input);
        start(parsedCode);
        let arrNode = sym.getArrNode();
        gra.initStrGraph();
        gra.buildNodesGraph(arrNode[0]);
        gra.buildEdgesGraph(arrNode[0]);
        gra.addEdgeBtwnCircle();
        let strGraph = gra.getStrGraph();
        let arrGraph = strGraph.split(/\r?\n/);
        var result = 'kod1->kod3';
        var result1 ='kod3=>operation: return z';
        assert.equal(arrGraph[4], result);
        assert.equal(arrGraph[2], result1);
    });

    it('8 check function with Return only', () => {
        var input = 'function foo(x, y, z){\n' +
            '   return x;\n' +
            '}\n';
        initCounter();
        initTable();
        initNode();
        initMapV();
        inputVariable('x=1,y=2,z=3');
        var parsedCode = parseCode(input);
        start(parsedCode);
        let arrNode = sym.getArrNode();
        gra.initStrGraph();
        gra.buildNodesGraph(arrNode[0]);
        gra.buildEdgesGraph(arrNode[0]);
        gra.addEdgeBtwnCircle();
        let strGraph = gra.getStrGraph();
        let arrGraph = strGraph.split(/\r?\n/);
        var result = 'kod1->kod2';
        var result1 ='kod2=>operation: return x';
        assert.equal(arrGraph[3], result);
        assert.equal(arrGraph[1], result1);
    });

    it('9 check colors of nodes', () => {
        var input = 'function foo(x, y, z){\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    }else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    return c;\n' +
            '}';
        initCounter();
        initTable();
        initNode();
        initMapV();
        inputVariable('x=1,y=2,z=3');
        var parsedCode = parseCode(input);
        start(parsedCode);
        let arrNode = sym.getArrNode();
        gra.initStrGraph();
        gra.buildNodesGraph(arrNode[0]);
        gra.buildEdgesGraph(arrNode[0]);
        gra.addEdgeBtwnCircle();
        let MapC = getColorMap();
        let strGraph = gra.getStrGraph();
        let arrGraph = strGraph.split(/\r?\n/);
        var result = false;
        var result1 =true;
        var res = '|white';
        var res1 = '|green';
        assert.equal(MapC[0], result);
        assert.equal(MapC[1], result1);
        assert.equal(arrGraph[4], res);
        assert.equal(arrGraph[6], res1);
    });

    it('10 check function with AssignmentExpression and VariableDeclaration', () => {
        var input = 'function foo(x, y, z){\n' +
            '    let b = a + y;\n' +
            '    let c = 0;   \n' +
            '    c = c + z + 5;\n' +
            'return c;\n' +
            '}';
        initCounter();
        initTable();
        initNode();
        initMapV();
        inputVariable('x=1,y=2,z=3');
        var parsedCode = parseCode(input);
        start(parsedCode);
        let arrNode = sym.getArrNode();
        gra.initStrGraph();
        gra.buildNodesGraph(arrNode[0]);
        gra.buildEdgesGraph(arrNode[0]);
        gra.addEdgeBtwnCircle();
        let strGraph = gra.getStrGraph();
        let arrGraph = strGraph.split(/\r?\n/);
        var res = 'kod1=>operation: b = a + y';
        var res1 = 'kod1->kod5';
        assert.equal(arrGraph[0], res);
        assert.equal(arrGraph[6], res1);
    });

});
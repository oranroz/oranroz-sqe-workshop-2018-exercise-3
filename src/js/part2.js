export {start,validationCode,initMapV,initCounter,deepCopy,parser,getColorMap,inputVariable,initTable,initNode,getArrNode};
let counter = 1;
let mapV = {};
let dicOfLine = {};
let colorMap = [];
let table = [];
let node = {};
let arrOfNodes = [];
let whileNode ={};
let circleCounter = 30;
function getColorMap() {
    return colorMap;
}
function initNode() {
    let lines = [];
    node = { Index: counter, Type: '', Lines: lines ,Boolean:true, NextT:'', NextF: ''};
}
function initTable() {
    table =[];
    arrOfNodes = [];
}
function initMapV() {
    mapV = {};
}
function initCounter() {
    counter =1;
    circleCounter = 30;
}
function deepCopy(dic){
    let dicLine={};

    for(var key in dic) {
        var value = dic[key];
        dicLine[key] = value;
    }
    dicOfLine[counter] = dicLine;
}
function getArrNode() {
    return arrOfNodes;
}
function start(parsedCode){
    let dic = {};
    dicOfLine = {};
    colorMap = [];
    dic = {};
    dicOfLine = {};let lines=[];
    whileNode = { Index: counter, Type: '', Lines: lines ,Boolean:true, NextT:'', NextF: ''};
    initNode();
    parser(parsedCode,dic,undefined,node,{});
}

function parser(parsedCode,dic,bool,nodeC,circleNode){
    if (parsedCode.type != null) {
        let f = dictionary[parsedCode.type](parsedCode,dic,bool,nodeC,circleNode);
        return f;
    }
}

function parsProgram(code,dic,bool,nodeC,circleNode) {
    if (code.body != null)
    {
        var i;
        for( i=0;i<code.body.length;i++){
            parser(code.body[i],dic,bool,nodeC,circleNode);
        }
    }
}

function parsFunctionDeclaration(code,dic,bool,nodeC,circleNode) {
    if(code.id != null)
    {parser(code.id,dic,bool,nodeC);}
    if(code.params != null)
    {
        var i;
        for( i=0;i<code.params.length;i++){
            dic[code.params[i].name] = code.params[i].name;
            table.push({ Line: counter, Type: code.type, Name: code.params[i].name ,Condition:'', Value: ''});
            //node.push({ Index: counter, Type: code.type, Lines: [code.params[i].name] ,Boolean:'True', NextT:parser(code.body,dic,bool), NextF: ''});
        }
        deepCopy(dic);
        counter++;
        if(code.body != null)
        {
            parser(code.body,dic,bool,nodeC,circleNode);
        }
    }

}

function parsIdentifier(code,dic,bool,nodeC,circleNode) {
    return code.name;
}

function parsBlockStatement(code,dic,bool,nodeC,circleNode) {
    for( let i=0;i<code.body.length;i++) {
        if (code.body[i].type === 'ReturnStatement')
            nodeC = checkWhereTheNextNode(nodeC);
        else if (nodeC.Type === 'WhileStatement') {
            if (nodeC.Boolean === true) {
                nodeC.NextT = initateN(nodeC.NextT);
                nodeC = nodeC.NextT;
            }
            else {
                nodeC.NextT = initateN(nodeC.NextT);
                nodeC = nodeC.NextT;
            }
        }
        parser(code.body[i],dic,bool,nodeC,circleNode);
    }
}
function checkWhereTheNextNode(nodeC) {
    if(nodeC.NextT != '') {
        arrOfNodes.push(nodeC);
        return nodeC.NextT;
    }else if(nodeC.NextF != '') {
        arrOfNodes.push(nodeC);
        return nodeC.NextF;
    }else{
        arrOfNodes.push(nodeC);
        return nodeC;
    }

}
function initateN(nodeC) {
    if (nodeC === '') {
        let lines = [];
        nodeC = {Index: counter, Type: '', Lines: lines, Boolean: true, NextT: '', NextF: ''};
        return nodeC;
    }else
        return nodeC;
}

function forIfInVarDec(nodeC) {
    if(nodeC.Type != '' && nodeC.Type !='AssignmentExpression')
        return true;
    else
        return false;
}
function checkVarDec(name,value,tempDic) {
    let arr;
    var finalVal = '';
    if(value === null){return mapV[name];}
    arr = checkV(value);
    for(let i=0;i<arr.length;i++)
    {
        let mishtane = arr[i];
        if(tempDic[mishtane] !== undefined){
            let val = tempDic[arr[i]];
            arr[i] = val;
        }
    }
    for(let i=0;i<arr.length;i++){
        finalVal = finalVal + arr[i];
    }
    finalVal = '(' + finalVal + ')';
    return finalVal;
}
function parsVariableDeclaration(code,dic,bool,nodeC,circleNode) {
    var i; var val;
    for(i=0;i<code.declarations.length;i++){
        let name = parser(code.declarations[i].id,dic,bool,nodeC,circleNode);
        if(code.declarations[i].init ==null){val = code.declarations[i].init;}
        else{val = parser(code.declarations[i].init,dic,bool,nodeC,circleNode);}
        let finalVal = checkVarDec(name,val,dic);
        let line = name + ' = ' + val;
        if(nodeC.Type !=code.type && forIfInVarDec(nodeC))
        {
            let lines =[];lines.push(line);
            let newNode = { Index: counter, Type: code.type, Lines: lines ,Boolean:nodeC.Boolean, NextT:'', NextF: ''};
            nodeC = nextOne(nodeC,newNode,circleNode);
        }else{ nodeC.Lines.push(line);nodeC.Type = code.type;}
        addWhileNode(nodeC);
        dic[name] = finalVal;
        table.push({ Line: counter, Type: code.type , Name:name ,Condition:'', Value: val});
    }
    deepCopy(dic);counter++;
}
function nextT(nodeC,newNode) {
    if(nodeC.NextT != null && nodeC.NextT != '') {
        newNode.Boolean = false;
        nodeC.NextF = newNode;
        arrOfNodes.push(nodeC);
        return nodeC.NextF;
    }else{
        newNode.Boolean = true;
        nodeC.NextT = newNode;
        arrOfNodes.push(nodeC);
        return nodeC.NextT;
    }
}
function nextF(nodeC,newNode) {
    if (nodeC.NextF != null && nodeC.NextF != '') {
        newNode.Boolean = true;
        nodeC.NextT = newNode;
        arrOfNodes.push(nodeC);
        return nodeC.NextT;
    } else {
        newNode.Boolean = false;
        nodeC.NextF = newNode;
        arrOfNodes.push(nodeC);
        return nodeC.NextF;
    }
}
function nextOne(nodeC,newNode,circleNode){
    if(nodeC.Type === 'IfStatement'){
        newNode.NextT = circleNode;
    }
    if(nodeC.Type === 'WhileStatement'){
        newNode.NextT = whileNode;
    }
    if(nodeC.Boolean === true)
    {
        return nextT(nodeC,newNode);
    }else{
        return nextF(nodeC,newNode);
    }
}

function parsExpressionStatement(code,dic,bool,nodeC,circleNode) {
    parser(code.expression,dic,bool,nodeC,circleNode);
}

function parsWhileStatement(code,dic,bool,nodeC,circleNode) {
    whileNode ={};let lines = [];
    let cond = parser(code.test,dic,bool,nodeC,circleNode);lines.push('while (' + cond + ')');
    let finalVal = checkVar(cond,dic);
    let condNum = replaceObjectToNum(finalVal);
    let bolleanColor = eval(checkOrAnd(condNum));
    let newNode  = { Index: counter, Type: code.type, Lines: lines ,Boolean:bolleanColor, NextT:'', NextF: ''};
    whileNode = { Index: counter, Type: code.type, Lines: lines ,Boolean:bolleanColor, NextT:'', NextF: ''};
    newNode = whileInsideIF(newNode,circleNode,nodeC);
    nodeC = addNextNode(nodeC,newNode);
    table.push({ Line: counter, Type: code.type , Name: '' ,Condition: cond, Value: ''});
    deepCopy(dic);
    counter++;
    parser(code.body,dic,bool,nodeC,circleNode);
}
function whileInsideIF(newNode,circleNode,nodeC) {
    if(nodeC.Type == 'IfStatement'){
        if(nodeC.Boolean == false)
            newNode.NextT = circleNode;
        if (nodeC.Boolean == true)
            newNode.NextF = circleNode;

    }
    return newNode;
}

function parsAssignmentExpression(code,dic,bool,nodeC,circleNode) {
    let name = parser(code.left,dic,bool,nodeC,circleNode);
    let val = parser(code.right,dic,bool,nodeC,circleNode);
    let finalVal = checkVar(val,dic);
    let line = name + ' = ' + val;
    if(nodeC.Type !=code.type && nodeC.Type != '' && nodeC.Type !='VariableDeclaration')
    {
        let lines =[];lines.push(line);
        let newNode = { Index: counter, Type: code.type, Lines: lines ,Boolean:nodeC.Boolean, NextT:'', NextF: ''};
        nodeC = nextOne(nodeC,newNode,circleNode);
    }else{ nodeC.Lines.push(line);nodeC.Type = code.type;
        arrOfNodes.push(nodeC);}
    addWhileNode(nodeC);
    dic[name] = finalVal;
    table.push({ Line: counter, Type: code.type , Name: name ,Condition:'', Value: val});
    deepCopy(dic);
    counter++;

}
function addWhileNode(nodeC) {
    if(whileNode.Type === 'WhileStatement'){
        if(nodeC.NextT != '') {
            (nodeC.NextT).NextT = whileNode;
            whileNode ='';
        }
        else{
            nodeC.NextT = whileNode;
            whileNode ='';
        }
    }
}

function parsBinaryExpression(code,dic,bool,nodeC,circleNode) {
    let left = parser(code.left,dic,bool,nodeC,circleNode);
    let right = parser(code.right,dic,bool,nodeC,circleNode);
    return left +' '+code.operator + ' '+  right;

}

function parsLiteral(code,dic,bool,nodeC,circleNode) {
    if(isNaN(code.value))
        return code.value;
    else
        return code.raw;
}

let tempNode = {};
function parsIfStatement(code,dic,bool,nodeC,circleNode) {
    let cond = parser(code.test,dic,bool,nodeC,circleNode);tempNode ={};
    table.push({ Line: counter, Type: code.type , Name: '' ,Condition: cond, Value: ''});
    let bolleanColor = forIfState(cond,dic,bool);
    if(bolleanColor){bool = false;}
    colorMap.push(bolleanColor);let lines = [];lines.push(cond);nodeC = ifAfterWhile(nodeC);
    let newIfNode = { Index: counter, Type: code.type, Lines: lines ,Boolean:bolleanColor, NextT:'', NextF: ''};
    nodeC = addNextNode(nodeC,newIfNode);
    deepCopy(dic);let circleN = { Index: circleCounter, Type: 'circle', Lines: '' ,Boolean:true, NextT:'', NextF: ''};
    counter++;circleCounter++;let tempDic = {};
    for(var key in dic) {
        var value = dic[key];
        tempDic[key] = value;}
    parser(code.consequent,dic,bolleanColor,nodeC,circleN);
    dic = tempDic;
    if(code.alternate != null)
        lastAlternate(code.alternate,dic,bool,nodeC,circleN);
    else{nodeC = addCircleNode(nodeC,circleN);}
}
function addCircleNode(nodeC,circleN) {
    if(nodeC.NextT == '')
        nodeC.NextT = circleN;
    if (nodeC.NextF == '')
        nodeC.NextF = circleN;
}
function ifAfterWhile(nodeC){
    let lines =[];
    if(nodeC.NextT.Type === 'WhileStatement') {
        nodeC = nodeC.NextT;
        if(nodeC.NextT == ''){
            nodeC.NextT = { Index: counter, Type: '', Lines: lines ,Boolean:true, NextT:'', NextF: ''};
            nodeC = nodeC.NextT;
        }else if(nodeC.NextF == ''){
            nodeC.NextF = { Index: counter, Type: '', Lines: lines ,Boolean:true, NextT:'', NextF: ''};
            nodeC = nodeC.NextF;
        }
    }
    return nodeC;
}
function addNextNode (nodeC,nextNode){
    if(nodeC.Type === ''){
        nodeC.Index = nextNode.Index;nodeC.Type = nextNode.Type;
        nodeC.Lines = nextNode.Lines;nodeC.Boolean = nextNode.Boolean;
        nodeC.NextT = nextNode.NextT;
        nodeC.NextF = nextNode.NextF;arrOfNodes.push(nodeC);
        NodeCopy(nodeC);
        return nodeC;
    }else if(nodeC.Boolean == false){
        nodeC.NextF = nextNode;
        arrOfNodes.push(nodeC);
        NodeCopy(nodeC);
        return nodeC.NextF;
    }else{
        nodeC.NextT = nextNode;
        arrOfNodes.push(nodeC);
        NodeCopy(nodeC);
        return nodeC.NextT;
    }
}
function NodeCopy(nodeC) {
    tempNode = { Index: '', Type: '', Lines: '' ,Boolean:'', NextT:'', NextF: ''};
    tempNode.Index = nodeC.Index;
    tempNode.Type = nodeC.Type;
    tempNode.Lines = nodeC.Lines;
    tempNode.Boolean = nodeC.Boolean;
    tempNode.NextT = nodeC.NextT;
    tempNode.NextF = nodeC.NextF;
}
function forIfState(cond,dic,bool){
    let finalVal = checkVar(cond,dic);
    let condNum = replaceObjectToNum(finalVal);
    let bolleanColor = eval(condNum);
    if(bool === undefined){
        return bolleanColor;
    }else{
        if (!bool) {
            return false;
        }else{
            return bolleanColor;}
    }
}
function parsElseStatement(code,dic,bool,nodeC,circleNode) {
    let cond = parser(code.test,dic,bool,nodeC,circleNode);tempNode ={};
    table.push({ Line: counter, Type: code.type , Name: '' ,Condition: cond, Value: ''});
    let bolleanColor = forIfState(cond,dic);
    if(bolleanColor){bool = false;}
    colorMap.push(bolleanColor);let lines = [];lines.push(cond);
    let newIfNode = { Index: counter, Type: code.type, Lines: lines ,Boolean:bolleanColor, NextT:'', NextF: ''};
    nodeC = addNextNode1(nodeC,newIfNode);
    deepCopy(dic);
    counter++;let tempDic = {};
    for(var key in dic) {
        var value = dic[key];
        tempDic[key] = value;
    }
    parser(code.consequent,dic,bool,nodeC,circleNode);
    dic = tempDic;
    if(code.alternate != null) {
        lastAlternate(code.alternate, dic, bool,nodeC,circleNode);
    }
}
function addNextNode1 (nodeC,nextNode){
    if(nodeC.Boolean == false)
    {
        nodeC.NextT = nextNode;
        arrOfNodes.push(nodeC);
        NodeCopy(nodeC);
        return nodeC.NextT;
    }else{
        nodeC.NextF = nextNode;
        arrOfNodes.push(nodeC);
        NodeCopy(nodeC);
        return nodeC.NextF;
    }
}
function lastAlternate(code,dic, bool,nodeC,circleNode) {
    if(code.type == 'IfStatement')
        parsElseStatement(code, dic, bool,nodeC,circleNode);
    else{
        if(bool === false)
        {
            colorMap.push(false);
        }else{
            colorMap.push(true);
        }
        parser(code,dic,bool,nodeC,circleNode);
    }
}

function parsReturnStatement(code,dic,bool,nodeC,circleNode) {
    let val = parser(code.argument,dic,bool,nodeC,circleNode);
    let lines = [];lines.push('return ' + val);
    let newNode = { Index: counter, Type: code.type, Lines: lines ,Boolean:true, NextT:'', NextF: ''};
    if(nodeC.NextF !='' && nodeC.NextT != '') {
        nodeC = returnToIf(nodeC);
        //nodeC = returnToWhile(nodeC);
    }
    addReturnNode(nodeC,newNode);
    table.push({ Line: counter, Type: code.type , Name: '' ,Condition: '', Value: val});
    deepCopy(dic);
    counter++;
}
function returnToIf(nodeC) {
    if(nodeC.NextT.Type =='IfStatement')
        nodeC = nodeC.NextT;
    else if(nodeC.NextF.Type =='IfStatement')
        nodeC = nodeC.NextF;
    return nodeC;
}
function addReturnNode(nodeC,newNode){
    if(nodeC.Type === 'IfStatement'){
        addReturnNode1(nodeC,newNode);
    }else{
        if(nodeC.NextF == '' && nodeC.NextT == '')
            nodeC.NextT = newNode;
        if(nodeC.NextF != '')
            nodeC.NextT = newNode;
        else
            nodeC.NextF = newNode;
        arrOfNodes.push(nodeC);
    }
}
function addReturnNode1(nodeC,newNode) {
    if(nodeC.NextT != '' && checkNode(nodeC)){
        nodeC = nodeC.NextT;
        nodeC = nodeC.NextT;
        nodeC.NextT = newNode;
    }
    if (nodeC.NextF !='' && checkNode1(nodeC)){
        nodeC = nodeC.NextF;
        nodeC = nodeC.NextT;
        nodeC.NextT = newNode;
    }
}
function checkNode1(nodeC) {
    if  (nodeC.NextF.Type === 'AssignmentExpression'||nodeC.NextF.Type === 'VariableDeclaration')
        return true;
    else
        return false;
}
function checkNode(nodeC) {
    if((nodeC.NextT.Type === 'AssignmentExpression'||nodeC.NextT.Type === 'VariableDeclaration'))
        return true;
    else
        return false;
}

function parsUnaryExpression(code,dic,bool,nodeC,circleNode) {
    let val = parser(code.argument,dic,bool,nodeC,circleNode);
    if(code.prefix == true)
    {
        return (code.operator + val);
    }
    else{
        return(val+code.operator);
    }
}

function parsMemberExpression(code,dic,bool,nodeC,circleNode) {
    let ob = parser(code.object,dic,bool,nodeC,circleNode);
    let pro = parser(code.property,dic,bool,nodeC,circleNode);
    return (ob + '[' + pro + ']');
}

function parsUpdateExpression(code,dic,bool,nodeC,circleNode) {
    let line ='';
    let val = parser(code.argument,dic,bool,nodeC,circleNode);
    if(code.prefix == true)
        line = (code.operator + val);
    else
        line = (val+code.operator);
    if(nodeC.Type != 'AssignmentExpression' && nodeC.Type != '' && nodeC.Type !='VariableDeclaration')
    {
        let lines =[];lines.push(line);
        let newNode = { Index: counter, Type: 'AssignmentExpression', Lines: lines ,Boolean:nodeC.Boolean, NextT:'', NextF: ''};
        nodeC = nextOne(nodeC,newNode,circleNode);
    }else{
        nodeC.Lines.push(line);nodeC.Type = 'AssignmentExpression';
    }
    addWhileNode(nodeC);
    return line;
}

function checkVar(value,tempDic) {
    let arr;
    var finalVal = '';
    if(value === null){return value;}
    arr = checkV(value);
    for(let i=0;i<arr.length;i++)
    {
        let mishtane = arr[i];
        if(tempDic[mishtane] !== undefined){
            let val = tempDic[arr[i]];
            arr[i] = val;
        }
    }
    for(let i=0;i<arr.length;i++){
        finalVal = finalVal + arr[i];
    }
    finalVal = '(' + finalVal + ')';
    return finalVal;
}
function checkV(value) {
    if (value.length > 1){
        return value.split(' ');
    }else{
        let arr = [value];
        return arr;
    }
}
function inputVariable(input) {
    mapV = {};
    let vars = [];
    vars = input.split(/,(?![^([]*[\])])/g).filter(s=>s!=='');
    for(let i =0;i<vars.length;i++){
        let tempV = [];
        vars[i] = vars[i].split(' ').join('');
        tempV = vars[i].split('=');
        if(tempV[1].includes('['))
            arrayVar(tempV[0],tempV[1]);
        else
            mapV[tempV[0]] = tempV[1];
    }
}
function arrayVar(name,arrStr) {
    let temp = arrStr.substring(1,arrStr.length-1);
    let arr = temp.split(',');
    for(let i =0 ;i<arr.length;i++){
        let finalName = name + '[' + i + ']';
        mapV[finalName] = arr[i];
    }
}
function validationCode(code) {
    let codeLine = code.split(/\r?\n/);
    let finalCode = [];let counterSpaceLine = 0;let index = whenFunctionStart(codeLine);
    for(let i=0;i<codeLine.length;i++)
    {let tempLine = codeLine[i].replace('\t','');
        if(isItValid(tempLine)){
            if(isItExpress(tempLine)) {
                if(i<index){finalCode.push(tempLine);}
                else{
                    let finalStr = replaceVar(tempLine, dicOfLine[i - counterSpaceLine + 1]);
                    finalCode.push(finalStr);
                }
            }
        }else{
            counterSpaceLine++;
            finalCode.push(tempLine);
        }
    }
    return finalCode;
}
function whenFunctionStart(lines) {
    for(let i=0;i<lines.length;i++)
    {
        if(lines[i].includes('function'))
            return i;
    }
}
function elseS(line) {
    if(line.includes('else') && !(line.includes('if'))){
        return true;
    }
}
function isItValid(line){

    if(line === '{' || line.split(' ').join('')==='' || line.split(' ').join('')==='}' || elseS(line))
        return false;
    else
        return true;
}
function replaceVar(line,dic) {
    let arrD =[];
    arrD =  line.split(/[\s<>,=()*/;{}%+-]+/).filter(s=>s!=='');
    for(let i = 0;i<arrD.length;i++)
    {
        let tempK = arrD[i];
        if (dic[tempK] != undefined) {

            if(!(tempK in mapV) )
                tempK = dic[arrD[i]];

            line = line.replace(arrD[i],tempK);
        }
    }
    return line;
}
function replaceObjectToNum(ex) {
    let arrN = [];
    arrN = ex.split(/[\s<>,=()*/;{}%+-]+/).filter(s=>s!=='');
    for(let j =0; j<arrN.length; j++)
    {
        let num = mapV[arrN[j]];
        if(num != null)
            ex = ex.replace(arrN[j],num);
        else {
            if(isNaN(arrN[j]))
            {
                num = '\'' +arrN[j]+'\'';
                ex = ex.replace(arrN[j],num);
            }
        }
    }
    return ex;
}

function isItExpress(line){
    if(line.includes('while') || line.includes('if') || line.includes('else') )
    {
        return true;
    }
    else{
        return isItExpress2(line);
    }

}
function isItExpress2(line) {
    if (line.includes('function') || line.includes('return')) {
        return true;
    }else if(line.includes('++') || line.includes('--')){
        return true;
    }
    else
        return checkEqual(line);
}
function checkEqual(line) {
    if(line.includes('=')){
        let ch = [];
        ch = line.split(/[ =]+/).filter(s=>s!='');
        if(ch[0] == 'let'){
            let n = mapV[ch[1]];
            if(n != null)
                return true;
            else return false;
        }
        else {
            let n = mapV[ch[0]];
            if(n != null)
                return true;
            else return false;
        }
    }else
        return lastOne(line);

}
function lastOne(line) {
    if(line.includes('let') && !line.includes('='))
        return true;
    else
        return false;
}
let dictionary = {
    'VariableDeclaration': parsVariableDeclaration,
    'Program' : parsProgram,
    'FunctionDeclaration': parsFunctionDeclaration,
    'BlockStatement': parsBlockStatement,
    'ExpressionStatement': parsExpressionStatement,
    'WhileStatement': parsWhileStatement,
    'AssignmentExpression': parsAssignmentExpression,
    'BinaryExpression': parsBinaryExpression,
    'Identifier': parsIdentifier,
    'Literal': parsLiteral,
    'IfStatement':parsIfStatement,
    'ReturnStatement': parsReturnStatement,
    'UnaryExpression': parsUnaryExpression,
    'MemberExpression': parsMemberExpression,
    'UpdateExpression': parsUpdateExpression
};

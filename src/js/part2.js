export {inputVariable};
export {start};
export {validationCode};
export {initMapV};
export {initCounter};
export {globalVarParsed};
export {deepCopy};
export {parser};
export {getColorMap};
export {initTable};
let counter = 1;
let mapV = {};
let dicOfLine = {};
let colorMap = [];
let table = [];
function getColorMap() {
    return colorMap;
}

function initTable() {
    table =[];
}
function initMapV() {
    mapV = {};
}
let b = '';
function initCounter() {
    counter =1;

}
function globalVarParsed(code){
    for( let i=0;i<code.body.length;i++){
        let temp = {};let codeG = code.body[i];
        if(codeG.type == 'ExpressionStatement') {
            let codi = codeG.expression;
            let name = parser(codi.left,temp,b);
            let value = parser(codi.right,temp,b);
            mapV[name] = value;
        }
        if(codeG.type == 'VariableDeclaration') {
            let arr = codeG.declarations;
            varDec(arr,temp,b);
        }
    }
}
function varDec(arr,temp,b) {
    for(let j = 0;j<arr.length;j++) {
        let name = parser(arr[j].id,temp,b);
        let value = checkInit(arr[j].init,temp,b);
        if(mapV[name]!=null){continue;}
        mapV[name] = value;
    }
}
function checkInit(code,temp,b) {
    if(code != null)
        return parser(code,temp,b);
    else
        return null;
}
function deepCopy(dic){
    let dicLine={};

    for(var key in dic) {
        var value = dic[key];
        dicLine[key] = value;
    }
    dicOfLine[counter] = dicLine;
}
function start(parsedCode){
    let dic = {};
    dicOfLine = {};
    colorMap = [];
    globalVarParsed(parsedCode);
    dic = {};
    dicOfLine = {};
    parser(parsedCode,dic,'true');
}

function parser(parsedCode,dic,bool){
    if (parsedCode.type != null) {
        let f = dictionary[parsedCode.type](parsedCode,dic,bool);
        return f;
    }
}

function parsProgram(code,dic,bool) {

    if (code.body != null)
    {
        var i;
        for( i=0;i<code.body.length;i++){
            parser(code.body[i],dic,bool);
        }
    }

}

function parsFunctionDeclaration(code,dic,bool) {
    if(code.id != null)
    {parser(code.id,dic,bool);}
    if(code.params != null)
    {
        var i;
        for( i=0;i<code.params.length;i++){
            dic[code.params[i].name] = code.params[i].name;
            table.push({ Line: counter, Type: code.type, Name: code.params[i].name ,Condition:'', Value: ''});
        }
        deepCopy(dic);
        counter++;
        if(code.body != null)
        {
            parser(code.body,dic,bool);
        }
    }

}

function parsIdentifier(code,dic,bool) {
    return code.name;
}

function parsBlockStatement(code,dic,bool) {

    var i;
    for( i=0;i<code.body.length;i++){
        parser(code.body[i],dic,bool);
    }


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
function parsVariableDeclaration(code,dic,bool) {
    var i; var val;
    for(i=0;i<code.declarations.length;i++){
        let name = parser(code.declarations[i].id,dic,bool);
        if(code.declarations[i].init ==null){
            val = code.declarations[i].init;
        }
        else{val = parser(code.declarations[i].init,dic,bool);}
        let finalVal = checkVarDec(name,val,dic);
        dic[name] = finalVal;
        table.push({ Line: counter, Type: code.type , Name:name ,Condition:'', Value: val});
    }
    deepCopy(dic);
    counter++;
}

function parsExpressionStatement(code,dic,bool) {
    parser(code.expression,dic,bool);
}

function parsWhileStatement(code,dic,bool) {
    let cond = parser(code.test,dic,bool);
    table.push({ Line: counter, Type: code.type , Name: '' ,Condition: cond, Value: ''});
    deepCopy(dic);
    counter++;
    parser(code.body,dic,bool);

}

function parsAssignmentExpression(code,dic,bool) {
    let name = parser(code.left,dic,bool);
    let val = parser(code.right,dic,bool);
    let finalVal = checkVar(val,dic);
    dic[name] = finalVal;
    table.push({ Line: counter, Type: code.type , Name: name ,Condition:'', Value: val});
    deepCopy(dic);
    counter++;

}

function parsBinaryExpression(code,dic,bool) {
    let left = parser(code.left,dic,bool);
    let right = parser(code.right,dic,bool);
    return left +' '+code.operator + ' '+  right;

}

function parsLiteral(code,dic,bool) {
    if(isNaN(code.value))
        return code.value;
    else
        return code.raw;
}

function checkOrAnd(cond) {
    if(cond.includes('||')){
        let arr = cond.split('|');
        let size = arr[0].length;
        let left = arr[0].substring(0,size-1);
        let right = arr[arr.length-1].substring(1);
        return left + ' || ' + right;
    }else if(cond.includes('&&')){
        let arr = cond.split('&');
        let size = arr[0].length;
        let left = arr[0].substring(0,size-1);
        let right = arr[arr.length-1].substring(1);
        return left + ' && ' + right;
    }
    else
        return cond;


}
function parsIfStatement(code,dic,bool) {
    bool = true;let cond = parser(code.test,dic,bool);
    table.push({ Line: counter, Type: code.type , Name: '' ,Condition: cond, Value: ''});
    let finalVal = checkVar(cond,dic);
    let condNum = replaceObjectToNum(finalVal);
    let bolleanColor = eval(checkOrAnd(condNum));
    if(bolleanColor){bool = false;}
    colorMap.push(bolleanColor);
    deepCopy(dic);
    counter++;
    let tempDic = {};
    for(var key in dic) {
        var value = dic[key];
        tempDic[key] = value;
    }
    parser(code.consequent,dic,bool);
    dic = tempDic;
    if(code.alternate != null)
        lastAlternate(code.alternate,dic,bool);
}
function forIfState(cond,dic){
    let finalVal = checkVar(cond,dic);
    let condNum = replaceObjectToNum(finalVal);
    let bolleanColor = eval(condNum);
    return bolleanColor;
}
function parsElseStatement(code,dic,bool) {
    let cond = parser(code.test,dic,bool);
    table.push({ Line: counter, Type: code.type , Name: '' ,Condition: cond, Value: ''});
    let bolleanColor = forIfState(cond,dic);
    if(bolleanColor){bool = false;}
    colorMap.push(bolleanColor);
    deepCopy(dic);
    counter++;
    let tempDic = {};
    for(var key in dic) {
        var value = dic[key];
        tempDic[key] = value;
    }
    parser(code.consequent,dic,bool);
    dic = tempDic;
    if(code.alternate != null) {
        lastAlternate(code.alternate, dic, bool);
    }
}
function lastAlternate(code,dic, bool) {
    if(code.type == 'IfStatement')
        parsElseStatement(code, dic, bool);
    else{
        colorMap.push(bool);
        parser(code,dic,bool);
    }
}
function parsReturnStatement(code,dic,bool) {
    let val = parser(code.argument,dic,bool);
    table.push({ Line: counter, Type: code.type , Name: '' ,Condition: '', Value: val});
    deepCopy(dic);
    counter++;
}

function parsUnaryExpression(code,dic,bool) {
    let val = parser(code.argument,dic,bool);
    if(code.prefix == true)
    {
        return (code.operator + val);
    }
    else{
        return(val+code.operator);
    }
}

function parsMemberExpression(code,dic,bool) {
    let ob = parser(code.object,dic,bool);
    let pro = parser(code.property,dic,bool);
    return (ob + '[' + pro + ']');
}


function parsLogicalExpression(code,dic,bool){
    var left = parser(code.left,dic,bool);
    var right = parser(code.right,dic,bool);
    return '(('+ left+')'+ code.operator +'('+ right+'))';
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
            let temp = dic[arrD[i]];
            line = line.replace(arrD[i],temp);
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
    'LogicalExpression':parsLogicalExpression
};
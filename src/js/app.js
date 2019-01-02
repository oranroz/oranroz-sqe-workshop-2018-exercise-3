import $ from 'jquery';
import {parseCode} from './code-analyzer';
import * as sym from './part2';



$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        $('.red').remove();
        $('.green').remove();
        $('.white').remove();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let input = $('#inputNum').val();
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        sym.initCounter();
        sym.initTable();
        index = 0;
        sym.initMapV();
        sym.inputVariable(input);
        sym.start(parsedCode);
        let finalCode = sym.validationCode(codeToParse);
        printColorCode(finalCode);
        JSON.stringify(parsedCode);
    });
});

let index = 0;
function printColorCode(code){
    let colorMap = sym.getColorMap();
    for(let i = 0;i<code.length;i++ ){
        let line = code[i];let color='';
        if(line.includes('if') || line.includes('else'))
        {
            let temp = colorMap[index];
            color = checkColor(temp);
            index++;
        }
        else
            color = 'white';
        $('#result').append($('<div>'+line+'</div>').addClass(color));
    }
}
function checkColor(temp) {
    if(temp === true)
        return 'green';
    else if (temp === false)
        return 'red';
}

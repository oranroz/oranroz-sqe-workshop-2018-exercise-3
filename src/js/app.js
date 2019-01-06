import $ from 'jquery';
import {parseCode} from './code-analyzer';
import * as sym from './part2';
import * as gra from './graph';
export {initAll,startGraph};

//
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        $('.red').remove();
        $('.green').remove();
        $('.white').remove();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let input = $('#inputNum').val();
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        initAll();
        sym.inputVariable(input);
        sym.start(parsedCode);
        let arrNode = sym.getArrNode();
        startGraph(arrNode);
        let strGraph = gra.getStrGraph();
        draw(strGraph);
        JSON.stringify(parsedCode);
    });
});
function initAll() {
    sym.initCounter();
    sym.initTable();
    sym.initNode();
    sym.initMapV();
}
function startGraph(arrNode) {
    gra.initStrGraph();
    gra.buildNodesGraph(arrNode[0]);
    gra.buildEdgesGraph(arrNode[0]);
    gra.addEdgeBtwnCircle();
}

function draw(str) {
    var diagram = flowchart.parse(str);
    diagram.drawSVG('diagram', {
        'x': 0, 'y': 0,
        'line-width': 2, 'line-length': 50, 'text-margin': 10, 'font-size': 12, 'font-color': 'black', 'line-color': 'black',
        'element-color': 'black', 'fill': 'white', 'yes-text': 'T', 'no-text': 'F', 'arrow-end': 'block', 'scale': 1,
        'symbols': {
            'start': {
                'font-color': 'black', 'element-color': 'green', 'fill': 'yellow'
            },
            'end':{
                'class': 'end-element'
            }
        },
        'flowstate' : {
            'green' : { 'fill' : 'green'}, 'white': {'fill' : 'white'}
        }
    });
}

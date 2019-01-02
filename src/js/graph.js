export {buildNodesGraph,initStrGraph,buildEdgesGraph,getStrGraph,addEdgeBtwnCircle};
let strGraph = '';
let circleCounter = 0;

function initStrGraph() {
    strGraph = '';
    circleCounter = 0;
}
function getStrGraph() {
    console.log(strGraph);
    return strGraph;
}
function whichColor(node){
    if(node.Boolean === true){
        return 'green';
    }else
        return 'white';
}
function getLines(node) {
    let nodeLine = node.Lines;
    let lineStr = '';
    for(let i = 0; i<nodeLine.length;i++){
        lineStr += nodeLine[i]+'\n';
    }
    return lineStr;
}
function buildNodesGraph(nodeGraph){
    if(nodeGraph != '')
    {
        let index = 'kod' + nodeGraph.Index;
        if(!strGraph.includes(index)) {
            let color = whichColor(nodeGraph);
            let content = getLines(nodeGraph);
            buildGraphCon(nodeGraph, color, content);
            buildNodesGraph(nodeGraph.NextT);
            buildNodesGraph(nodeGraph.NextF);
        }
    }

}

function buildGraphCon(nodeGraph,color,content) {
    if (nodeGraph.Type == 'VariableDeclaration' || nodeGraph.Type == 'AssignmentExpression' || nodeGraph.Type == 'ReturnStatement')
        strGraph += 'kod' + nodeGraph.Index + '=>operation: ' + content + '|' + color + '\n';
    else
        buildGraphCon1(nodeGraph,color,content);
}

function buildGraphCon1(nodeGraph,color,content) {

    if (nodeGraph.Type == 'IfStatement' || nodeGraph.Type == 'WhileStatement')
        strGraph += 'kod' + nodeGraph.Index + '=>condition: ' + content + '|' + color + '\n';
    else{
        circleCounter++;
        strGraph += 'kod' + nodeGraph.Index + '=>start: ' + '|' + color + '\n';
    }
}

function addEdgeForCond(nodeGraph,name) {
    if(nodeGraph.NextT != '' && nodeGraph.NextF != '')
    {
        let trueNode = nodeGraph.NextT;
        let falseNode = nodeGraph.NextF;
        let trueName = 'kod' + trueNode.Index;
        let falseName= 'kod' + falseNode.Index;
        let str = name + '(yes)->'+ trueName;
        if(!strGraph.includes(str))
            strGraph += name + '(yes)->'+ trueName+'\n';
        str = name + '(no,right)->' + falseName;
        if(!strGraph.includes(str))
            strGraph += name + '(no,right)->' + falseName + '\n';
    }
}
function buildEdgesGraph(nodeGraph) {
    if(nodeGraph != '') {
        let name = 'kod' + nodeGraph.Index;
        if(nodeGraph.Type == 'IfStatement' || nodeGraph.Type == 'WhileStatement'){
            addEdgeForCond(nodeGraph,name);
        }
        if(nodeGraph.NextT != ''){
            addEdge(nodeGraph,name);
        }
        buildEdgesGraph(nodeGraph.NextT);
        buildEdgesGraph(nodeGraph.NextF);
    }
}
function addEdge(nodeGraph,name) {
    let nextName = 'kod' + nodeGraph.NextT.Index;
    let str = name + '->' + nextName;
    if(!strGraph.includes(str))
        strGraph += name + '->' + nextName+'\n';
}
function addEdgeBtwnCircle() {
    if(circleCounter>1){
        let num = circleCounter-1;
        let name = 'kod3' + num;
        for(let i = circleCounter-2;i>-1;i--){
            let nextCir = 'kod3' + i;
            strGraph += name + '->' + nextCir+'\n';
            name = nextCir;
        }
    }
}
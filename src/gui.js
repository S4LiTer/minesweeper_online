var timeInSecondsDevidedByHundret=0;
var timerEndedBool=true;
var variableStartTime;

var field_height = 20;
var field_width = 20;
var mine_count = 75;


var playing =true;
var covered_tiles = field_height*field_width;
var mines_left = mine_count;

function StartTimer(){
    timeInSecondsDevidedByHundret=Date.now();
    timerEndedBool=false;
    variableStartTime = Date.now()
    Timer(Date.now());
}
async function Timer(timeInSecondsDevidedByHundret){
    if(timerEndedBool){
        return 0;
    }
    const element = document.getElementById("time");
    timeInSecondsDevidedByHundret=timeInSecondsDevidedByHundret-variableStartTime;
    element.innerHTML = ZeroPad(Math.round(timeInSecondsDevidedByHundret/1000), 3);
    await new Promise(r => setTimeout(r,1000));
    Timer(Date.now());
}

function StopTimer(){
    timerEndedBool=1;
    return Date.now()-variableStartTime;
}
function ZeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}

function show_mine_count(change) {
    let display = document.getElementById("mines_left");
    mines_left += change;
    display.innerHTML = ZeroPad(mines_left, 3);
}

function reset() {
    StopTimer();
    playing = true;
    covered_tiles = field_height*field_width;
    mines_left = mine_count;
    setup()
}

let el = document.getElementById("reset");
el.addEventListener('click', function handleClick(event) {
    reset()
});

document.getElementById("edit").addEventListener('click', function(){
    document.getElementById('controls').style.display = 'grid'
    document.getElementById('edit').style.display = 'none'
})
document.getElementById("submit").addEventListener('click', function(){
    document.getElementById('controls').style.display = 'none'
    document.getElementById('edit').style.display = 'block'
    field_width = parseInt(document.getElementById('field_width').value)
    field_height = parseInt(document.getElementById('field_height').value)
    mine_count = parseInt(document.getElementById('field_mines').value)
    reset()
})
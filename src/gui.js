
var timeInSecondsDevidedByHundret=0;
var timerEndedBool=true;
var variableStartTime;

var field_height = 30;
var field_width = 30;
var mine_count = 55;

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
    document.getElementById('controls').style.visibility = 'visible'
    document.getElementById('edit').style.visibility = 'hidden'
})
document.getElementById("submit").addEventListener('click', function(){
    document.getElementById('controls').style.visibility = 'hidden'
    document.getElementById('edit').style.visibility = 'visible'
    field_width = document.getElementById('field_width').value
    field_height = document.getElementById('field_height').value
    mine_count = document.getElementById('field_mines').value 
    reset()
})
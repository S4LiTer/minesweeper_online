
var timeInSecondsDevidedByHundret=0;
var timerEndedBool=true;
var variableStartTime;



function StartTimer(){
    timeInSecondsDevidedByHundret=Date.now();
    timerEndedBool=false;
    variableStartTime = Date.now()
    Timer(Date.now());
}
async function Timer(timeInSecondsDevidedByHundret){
    const element = document.getElementById("time");
    timeInSecondsDevidedByHundret=timeInSecondsDevidedByHundret-variableStartTime;
    element.innerHTML = ZeroPad(Math.round(timeInSecondsDevidedByHundret/1000), 3);
    if(timerEndedBool){
        return 0;
    }
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
    const field_height = 30;
    const field_width = 30;
    const mine_count = 55;
    covered_tiles = field_height*field_width;
    mines_left = mine_count;
    setup()
}

let el = document.getElementById("reset");
el.addEventListener('click', function handleClick(event) {
    reset()
});

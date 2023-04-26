var timeInSecondsDevidedByHundret=0;
var timerEndedBool=true;
var variableStartTime;

var field_height = 30;
var field_width = 30;
var mine_count = 55;

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
    document.getElementById("ScoreField").style.visibility = "hidden"
    document.getElementById("reset").src = `img/happy.png`
    setup()
}

let el = document.getElementById("reset");
el.addEventListener('click', function handleClick(event) {
    reset()
});

document.getElementById("edit").addEventListener('click', function(){
    controlField = document.getElementById('controls').style
    switch(controlField.display) {
        case '':
            controlField.display = 'grid'
            break;
        case 'none':
            controlField.display = 'grid'
            break;
        case 'grid':
            controlField.display = 'none'
            break; 
    }
    document.getElementById('field_width').value = field_width
    document.getElementById('field_height').value = field_height
    document.getElementById('field_mines').value = mine_count
})
document.getElementById("submit").addEventListener('click', function(){
    document.getElementById('controls').style.display = 'none'
    document.getElementById('edit').style.display = 'block'
    let us_width = parseInt(document.getElementById('field_width').value)
    let us_height = parseInt(document.getElementById('field_height').value)
    let us_count = parseInt(document.getElementById('field_mines').value)

    us_width = us_width < 1 || isNaN(us_width) ? field_width : us_width 
    us_height = us_height < 1 || isNaN(us_height) ? field_height : us_height
    us_count = us_count > us_width * us_height || isNaN(us_count) ? mine_count : us_count

    field_width = us_width
    field_height = us_height
    mine_count = us_count


    if(field_width < 10) {
        document.getElementById('reset').style.display = 'none'
    }
    else {
        document.getElementById('reset').style.display = 'block'        
    }
    if(field_width < 7) {
        document.getElementById('play_time').style.display = 'none'
    }
    else {
        document.getElementById('play_time').style.display = 'block'
    }
    if(field_width < 4) {
        document.getElementById('info').style.display = 'none'
    }
    else {
        document.getElementById('info').style.display = 'flex'
    }

    reset()
})
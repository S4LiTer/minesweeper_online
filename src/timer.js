var timeInSecondsDevidedByHundret=-1;
var timerEndedBool=true;
var startTime;

function StartTimer(){
    timeInSecondsDevidedByHundret=-1;
    timerEndedBool=false;
    startTime = Date.now()
    Timer();
}
async function Timer(){
    const element = document.getElementById("Timer");
    timeInSecondsDevidedByHundret=timeInSecondsDevidedByHundret+1;
    element.innerHTML = timeInSecondsDevidedByHundret;
    if(timerEndedBool){
        return 0;
    }
    await new Promise(r => setTimeout(r,1000));
    Timer();
}

function StopTimer(){
    timerEndedBool=1;
    return Date.now()-startTime;
}
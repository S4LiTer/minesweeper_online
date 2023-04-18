function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function RandomMines(width, height, mineCount) {
    let mineField = [];
    for(let y=0; y<height; y++){
        let row = [];
        for(let x=0;x<width;x++){
            row[x]=0;
        }
        mineField[y]=row;
    }
    for(let i=0, x=0, y=0; i<mineCount;i++){
        y=getRandomInt(0,height);
        x=getRandomInt(0,width);
        if(mineField[y][x]!=9){
            mineField[y][x]=9; 
        }
        else{
            i--;
        }

    }

    
    return mineField;
}

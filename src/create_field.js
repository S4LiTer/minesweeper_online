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

    mineField = get_mine_count(mineField);    
    return mineField;
}

function MakeField(width, height) {
    //Get mine using document.getElementById("{line} {column}")

    field = document.getElementById("MineField")
    //Get field element

    for(let y = 0; y < height; y++) {
        //Create lines of Mine field
        line = `<div class="line" id="${y}">`
        field.innerHTML += line
        field_line = document.getElementById(y)
        for(let x = 0; x < width; x++) {
            //Create mines in lines
            mines = `<div class="mine covered" id="${x} ${y}"></div>`
            field_line.innerHTML += mines
        }
    }
}



function get_mine_count(mine_field) {
    var height = mine_field.length;
    var width = mine_field[0].length;

    for(let y = 0; y<height; y++) {
        for(let x = 0; x<width; x++) {
            if(mine_field[y][x] > 8)
                continue;

            mine_field[y][x] = check_nearby_mines(mine_field, x, y, height, width);
        }
    }


    return mine_field;

}

function check_nearby_mines(mine_field, x, y, height, width) {
    var mine_count = 0;

    for(let _y = -1; _y < 2; _y++) {
        var nearby_y = y+_y;
        if(nearby_y < 0 || nearby_y >= height)
            continue;

        for(let _x = -1; _x < 2; _x++) {
            var nearby_x = x+_x;
            if(nearby_x < 0 || nearby_x >= width)
                continue;

            if(mine_field[nearby_y][nearby_x] > 8)
                mine_count++;
        }
    }

    return mine_count;
}


function uncover(x, y, square) {
    square.style.backgroundColor = "red";


    if(mine_field[y][x] == 9) {
        alert("xdlmao");
        window.location.reload();
        return;
    }

    if(mine_field[y][x] != 0){
        return;}

    square.className = "mine uncovered";

    for(let _y = -1; _y < 2; _y++) {
        let nearby_y = y+_y;
        if(nearby_y < 0 || nearby_y >= field_height)
            continue;
            

        selector = `${x} ${nearby_y}`;
        nearby_empty_square = document.getElementById(selector);

        if(nearby_empty_square.className.split(/[ ,]+/)[1] == "uncovered")
            continue
            
        uncover(x, nearby_y, nearby_empty_square);


    }

    for(let _x = -1; _x < 2; _x++) {
        let nearby_x = x+_x;
        if(nearby_x < 0 || nearby_x >= field_width)
            continue;

        selector = `${nearby_x} ${y}`;
        nearby_empty_square = document.getElementById(selector);

        if(nearby_empty_square.className.split(/[ ,]+/)[1] == "uncovered")
            continue

        uncover(nearby_x, y, nearby_empty_square);


    }
}



const field_height = 5;
const field_width = 10;
const mine_count = 10;

MakeField(field_width, field_height);
const mine_field = RandomMines(field_width, field_height, mine_count)

console.log(mine_field);

const squares = document.querySelectorAll(".mine");
squares.forEach(square => {
    square.addEventListener('click', function handleClick(event) {
        let x = Number(square.id.split(/[ ,]+/)[0]);
        let y = Number(square.id.split(/[ ,]+/)[1]);
        
        uncover(x, y, square)
    });
});
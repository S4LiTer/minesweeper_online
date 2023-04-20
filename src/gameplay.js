function win() {
    StopTimer();
}

function lose(mine_field) {
    for(let x = 0; x<field_width; x++) {
        for(let y = 0; y<field_height; y++) {
            if(mine_field[y][x] < 9)
                continue;

            var selector = `${x} ${y}`;
            var bomb = document.getElementById(selector);
            bomb.style.backgroundImage = "url(img/mine.png)";
        }
    }
    playing = false;
    StopTimer();
}


function flag(square) {
    if(square.className.split(/[ ,]+/)[1] == "covered" && mines_left > 0) {
        square.className = "mine flagged";
        square.style.backgroundColor = "#80808080";
        square.style.backgroundImage = "url(img/flag.png)";

        show_mine_count(-1);
    }
    else if(square.className.split(/[ ,]+/)[1] == "flagged") {
        square.className = "mine covered";
        square.style.backgroundColor = "#80808080";
        square.style.backgroundImage = "url(img/none.png)";

        show_mine_count(1);
    }
}


function click_on_number(x, y, square, mine_field, uncover_all) {
    if(square.className.split(/[ ,]+/)[1] != "uncovered")
        return;
    if(mine_field[y][x] == 0)
        return;
    
    var flags_nearby = 0;

    for(let _y = -1; _y < 2; _y++) {
        var nearby_y = y+_y;
        if(nearby_y < 0 || nearby_y >= field_height)
            continue;

        for(let _x = -1; _x < 2; _x++) {
            var nearby_x = x+_x;
            if(nearby_x < 0 || nearby_x >= field_width)
                continue;

            if(_x == 0 && _y == 0)
                continue;


            var selector = `${nearby_x} ${nearby_y}`;
            var nearby_square = document.getElementById(selector);
            
            if (!uncover_all) {
                
                if(nearby_square.className.split(/[ ,]+/)[1] == "flagged")
                    flags_nearby++;
            }
            else {
                uncover(nearby_x, nearby_y, nearby_square, mine_field, true)
            }
        }
    }
    
    if(flags_nearby == mine_field[y][x]) {
        click_on_number(x, y, square, mine_field, true);
    }
}


function uncover(x, y, square, mine_field) {
    if(square.className.split(/[ ,]+/)[1] != "covered")
        return;


    square.style.backgroundColor = "lightgrey";
    square.className = "mine uncovered";

    covered_tiles--;
    if(mine_field[y][x] == 9) {
        lose(mine_field);
        return;
    }
    else if(covered_tiles == mine_count) {
        win();
    }

    AI.uncover(x, y, mine_field[y][x])

    if(mine_field[y][x] != 0){
        square.style.backgroundImage = `url(img/num_${mine_field[y][x]}.png)`;
        return;
    }


    for(let _y = -1; _y < 2; _y++) {
        let nearby_y = y+_y;
        if(nearby_y < 0 || nearby_y >= field_height)
            continue;
            

        selector = `${x} ${nearby_y}`;
        nearby_square = document.getElementById(selector);
        
        uncover(x, nearby_y, nearby_square, mine_field) 


    }

    for(let _x = -1; _x < 2; _x++) {
        let nearby_x = x+_x;
        if(nearby_x < 0 || nearby_x >= field_width)
            continue;

        selector = `${nearby_x} ${y}`;
        nearby_square = document.getElementById(selector);

        
        uncover(nearby_x, y, nearby_square, mine_field);


        if(mine_field[y][nearby_x] == 0)
            continue;


        for(let _corner_y = -1; _corner_y < 2; _corner_y++) {
            if(_corner_y == 0)
                continue;

            let corner_y = y+_corner_y;
    

            selector = `${x} ${corner_y}`;
            nearby_square = document.getElementById(selector);

            if(nearby_square == null)
                continue;

            if(mine_field[corner_y][x] == 0)
                continue;


            if(nearby_square.className.split(/[ ,]+/)[1] != "uncovered")
                continue;


            selector = `${nearby_x} ${corner_y}`;
            nearby_square = document.getElementById(selector);
                
            uncover(nearby_x, corner_y, nearby_square, mine_field);
        }
        
        

    }
}
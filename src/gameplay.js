function win() {
    alert("you won xd")
    window.location.reload();
}

function lose() {
    alert("you lost xdxd weak");
    window.location.reload();
}


function flag(square) {
    if(square.className.split(/[ ,]+/)[1] == "covered") {
        square.className = "mine flagged";
        square.style.backgroundColor = "#80808080";
        square.style.backgroundImage = "url(img/flag.png)";
    }
    else if(square.className.split(/[ ,]+/)[1] == "flagged") {
        square.className = "mine covered";
        square.style.backgroundColor = "#80808080";
        square.style.backgroundImage = "url(img/none.png)";
    }
}


function uncover(x, y, square, mine_field, field_height, field_width) {
    if(square.className.split(/[ ,]+/)[1] != "covered")
        return;


    square.style.backgroundColor = "lightgrey";
    square.className = "mine uncovered";

    covered_tiles--;
    if(mine_field[y][x] == 9) {
        lose();
    }
    else if(covered_tiles == mine_count) {
        win();
    }

    if(mine_field[y][x] != 0){
        square.style.backgroundImage = `url(img/num_${mine_field[y][x]}.png)`;
        return;
    }


    for(let _y = -1; _y < 2; _y++) {
        let nearby_y = y+_y;
        if(nearby_y < 0 || nearby_y >= field_height)
            continue;
            

        selector = `${x} ${nearby_y}`;
        nearby_empty_square = document.getElementById(selector);
        
        uncover(x, nearby_y, nearby_empty_square, mine_field, field_height, field_width) 


    }

    for(let _x = -1; _x < 2; _x++) {
        let nearby_x = x+_x;
        if(nearby_x < 0 || nearby_x >= field_width)
            continue;

        selector = `${nearby_x} ${y}`;
        nearby_empty_square = document.getElementById(selector);

        
        uncover(nearby_x, y, nearby_empty_square, mine_field, field_height, field_width);


        if(mine_field[y][nearby_x] == 0)
            continue;


        for(let _corner_y = -1; _corner_y < 2; _corner_y++) {
            if(_corner_y == 0)
                continue;

            let corner_y = y+_corner_y;
    

            selector = `${x} ${corner_y}`;
            nearby_empty_square = document.getElementById(selector);

            if(nearby_empty_square == null)
                continue;

            if(mine_field[corner_y][x] == 0)
                continue;


            if(nearby_empty_square.className.split(/[ ,]+/)[1] != "uncovered")
                continue;


            selector = `${nearby_x} ${corner_y}`;
            nearby_empty_square = document.getElementById(selector);
                
            uncover(nearby_x, corner_y, nearby_empty_square, mine_field, field_height, field_width);
        }
        
        

    }
}

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
            mines = `<div class="mine covered" id="${y} ${x}"></div>`
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

            mine_field[y][x] = check_nearby_squares(mine_field, x, y, height, width);
        }
    }


    return mine_field;

}

function check_nearby_squares(mine_field, x, y, height, width) {
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

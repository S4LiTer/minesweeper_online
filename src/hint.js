var depth = 0;

class minesweeperAI {
constructor(height, width) {
    this.generate_field(height, width);
}

generate_field(height, width) {
    this.max_depth = 0;
    this.height = height;
    this.width = width;
    this.covered_minefield = [];
    this.probability_table = [];

    for(let y=0; y<height; y++){
        let row = [];
        for(let x=0;x<width;x++){
            row[x]=10;

        }
        this.covered_minefield[y]=row;
    }

    for(let y=0; y<height; y++){
        let row = [];
        for(let x=0;x<width;x++){
            row[x]=0;

        }
        this.probability_table[y]=row;
    }
}

uncover(x, y, value) {
    this.covered_minefield[y][x] = value;
}



predict() {
    this.valid_iterations = 0;
    let local_mine_field = this.copy_matrix(this.covered_minefield);
    console.log(this.collapse(local_mine_field, [[[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]], 2]))
    console.log(local_mine_field);
    console.log(this.valid_iterations);
    /*for(let y = 0; y < this.height; y++ ) {
        for(let x = 0; x < this.width; x++ ) {
            if(this.get_squares_around(x, y, this.covered_minefield, 8) == 0) {
                this.probability_table[y][x] = 50;
                continue;
            }
            
            if(this.covered_minefield[y][x] == 10) {
                let local_mine_field = this.copy_matrix(this.covered_minefield);
                console.log(this.collapse(x, y, local_mine_field))
                //if(this.collapse(x, y, local_mine_field))
                    //console.log(local_mine_field);
            }
        }
    }*/
}

collapse(local_mine_field, collapse_array) {

    let mines_to_place = collapse_array[1];

    collapse_array[0].forEach(coords => {
        if(local_mine_field[coords[1]][coords[0]] == 9) {
            mines_to_place--;
        }
    });

    if(mines_to_place == 0) {
        return;}

    else {
        console.log("mine is beeing placed by:", collapse_array[1]);
        console.log(this.copy_matrix(local_mine_field));
    }
            

        
    for(let coords_index = 0; coords_index < collapse_array[0].length; coords_index++) {
        let x = collapse_array[0][coords_index][0];
        let y = collapse_array[0][coords_index][1];

        if(local_mine_field[y][x] != 10 || mines_to_place < 1){
            continue;
        }
            
        local_mine_field[y][x] = 9;
        mines_to_place--;

        console.log("result: ");
        console.log(this.copy_matrix(local_mine_field));

        if(mines_to_place > 0)
            {this.collapse(local_mine_field, collapse_array);}

        if(!this.valid(local_mine_field)) {
            local_mine_field[y][x] = 10;
            mines_to_place++;
        }
        else {
            console.log("valid result");
            local_mine_field[y][x] = 10;
            mines_to_place++;
            this.valid_iterations++;
        }
            
    }
}

valid(mine_field_to_verify) {
    var is_valid = true;

    for(let y = 0; y < mine_field_to_verify.length; y++) {
        for(let x = 0; x < mine_field_to_verify[0].length; x++) {
            let square_value = mine_field_to_verify[y][x];

            if(square_value >= 9)
                continue;

            if(square_value != this.get_squares_around(x, y, mine_field_to_verify, 9).length) {
                is_valid = false;
                break;
            }

        }
    }
    return is_valid;
}

/*
collapse(x, y, local_mine_field, value_to_test = 9) {
    depth++;
    var valid = true;
    var valid_iterations_count = 0;
    local_mine_field[y][x] = value_to_test;
    
    var coll = true;
    let number_around = this.get_squares_around(x, y, local_mine_field, 8);
    number_around.forEach(coords => {
        if(valid) {
            valid_iterations_count = this.verify_numbers_around(local_mine_field, coords[0], coords[1], true);
            coll = false;
            if(valid_iterations_count == 0) {
                valid = false;
            }
        }

        
    });

    if(depth > this.max_depth && valid) {
        this.max_depth = depth
        console.log(valid_iterations_count);
        console.log(this.copy_matrix(local_mine_field));
    }

    depth--;
    local_mine_field[y][x] = 10;
    return valid_iterations_count;
}
verify_numbers_around(local_mine_field, x, y, collapse_safe_tiles = false) {
    let mines_around = this.get_squares_around(x, y, local_mine_field, 9).length

    if(mines_around < local_mine_field[y][x]){
        let uncovered_around = this.get_squares_around(x, y, local_mine_field, 10)
        let valid_iterations_count = 0;

        uncovered_around.forEach(coords => {
            valid_iterations_count += this.collapse(coords[0], coords[1], local_mine_field);
        });

        return valid_iterations_count
    }

    if(mines_around == local_mine_field[y][x]) {
        //console.log("mines around:", mines_around, " number:", local_mine_field[y][x], "(",x, y,")");
        let uncovered_around = this.get_squares_around(x, y, local_mine_field, 10);


        if(uncovered_around.length > 0 && collapse_safe_tiles)
            var valid_iterations_count = this.collapse(uncovered_around[0][0], uncovered_around[0][1], local_mine_field, 11);

        if(valid_iterations_count != 0)
            return 1;

        return 0;
    }

    if(mines_around > local_mine_field[y][x]){
        return 0;
    }
}
*/
copy_matrix(matrix_to_copy) {
    var copy = []

    for(let y = 0; y < matrix_to_copy.length; y++ ) {
        let row = [];
        for(let x = 0; x < matrix_to_copy[0].length; x++ ) {
            row.push(matrix_to_copy[y][x]);
        }

        copy.push(row);
    }

    return copy;
}



get_squares_around(x, y, matrix, square_type) {
    /*
    sqare types:
        - covered - 10
        - marked as mine - 9
        - uncovered - 8
    */

    var squares = [];

    for(let dy = -1; dy < 2; dy++ ) {
        let nearby_y = dy + y;
        if(nearby_y < 0 || nearby_y >= this.height)
            continue;
        for(let dx = -1; dx < 2; dx++ ) {
            if(dx == 0 && dy == 0) 
                continue;

            let nearby_x = dx + x;
            if(nearby_x < 0 || nearby_x >= this.width)
                continue;

            let tile_value = matrix[nearby_y][nearby_x];

            if(square_type == 10 && tile_value == 10) {
                squares.push([nearby_x, nearby_y]);
            }
            if(square_type == 9 && tile_value == 9) {
                squares.push([nearby_x, nearby_y]);
            }
            if(square_type == 8 && tile_value <= 8) {
                squares.push([nearby_x, nearby_y]);
            }
            
        }
    }

    return squares;
}



}
class minesweeperAI {
constructor(height, width) {
    this.generate_field(height, width);
}

generate_field(height, width) {
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



predict(x, y) {

    let local_mine_field = this.copy_matrix(this.covered_minefield);
    console.log(this.collapse(0, 0, local_mine_field))
    console.log(local_mine_field);
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


collapse(x, y, local_mine_field, value_to_test = 9) {
    var valid = true;
    var valid_iterations_count = 0;
    local_mine_field[y][x] = value_to_test;
    console.log("trying", x, y, "as", value_to_test);
    this.copy_matrix(local_mine_field).forEach(a => {
        var _a = []
        a.forEach(element => {
            if(element < 10) {
                element = `0${element}`;
                _a.push(element)
                return;
            }
            element = `${element}`;
            _a.push(element)
        });

        console.log(_a);
    });
    

    let number_around = this.get_squares_around(x, y, local_mine_field, 8);
    number_around.forEach(coords => {
        if(valid) {
            valid_iterations_count = this.verify_numbers_around(local_mine_field, coords[0], coords[1]);

            if(valid_iterations_count == 0) {
                valid = false;
            }
        }

        
    });
    local_mine_field[y][x] = 10;
    console.log(valid_iterations_count);
    return valid_iterations_count;
}


verify_numbers_around(local_mine_field, x, y) {
    let mines_around = this.get_squares_around(x, y, local_mine_field, 9).length

    console.log("mines around:", mines_around, " number:", local_mine_field[y][x]);

    if(mines_around < local_mine_field[y][x]){
        let uncovered_around = this.get_squares_around(x, y, local_mine_field, 10)
        let valid_iterations_count = 0;

        uncovered_around.forEach(coords => {
            valid_iterations_count += this.collapse(coords[0], coords[1], local_mine_field);
        });

        return valid_iterations_count
    }

    if(mines_around == local_mine_field[y][x]) {

        let uncovered_around = this.get_squares_around(x, y, local_mine_field, 10)
        let valid_iterations_count = 1;

        uncovered_around.forEach(coords => {
            if(valid_iterations_count != 0)
                valid_iterations_count = this.collapse(coords[0], coords[1], local_mine_field, 11);


        });
        if(valid_iterations_count != 0)
            return 1;

        return 0;
    }

    if(mines_around > local_mine_field[y][x]){
        console.log("nonono");
        return 0;
    }
}


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
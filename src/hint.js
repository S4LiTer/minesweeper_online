var depth = 0;

class minesweeperAI {
constructor(height, width, total_mine_count) {
    this.generate_field(height, width, total_mine_count);
}

generate_field(height, width, total_mine_count) {
    this.total_mine_count = total_mine_count;
    this.max_depth = 0;
    this.height = height;
    this.width = width;
    this.completed = false;
    this.covered_minefield = [];
    this.probability_table = [];
    this.valid_mine_fields = [];

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

play() {
    this.completed = false;
    let steps = 0
    while(!this.completed) {
        this.completed = this.predict();
        if(!this.completed) {this.completed = !playing;}

        console.log("step:", steps);
        steps++;
    }
}


predict() {

    let uncovered_tiles_left = 0;

    for(let y = 0; y < this.height; y++ ) {
        for(let x = 0; x < this.width; x++ ) {
            if(this.covered_minefield[y][x] == 10) {
                uncovered_tiles_left++;
            }
        }
    }

    if((uncovered_tiles_left-this.total_mine_count) == 0) {
        console.log("already solved");
        return true;
    }

    console.log("uncovered tiles left:",(uncovered_tiles_left-this.total_mine_count));

    this.valid_iterations = 0;
    this.valid_mine_fields = [];
    let local_mine_field = this.copy_matrix(this.covered_minefield);
    let result = this.create_collapse_array(local_mine_field)

    console.log("valid iterations: ", this.valid_iterations);
    

    if(this.valid_iterations) {
        this.create_probability_table()
        this.uncover_by_probability();
    }

    return false;
}

create_collapse_array(local_mine_field) {
    var all_numbers = [];

    for(let y = 0; y < local_mine_field.length; y++) {
        for(let x = 0; x < local_mine_field[0].length; x++) {
            let square_value = local_mine_field[y][x];

            if(square_value >= 9 || square_value <= 0)
                continue;

            all_numbers.push([x,y]);
        }
    }

    if(all_numbers.length == 0) {
        let rand_x = Math.round((Math.random()*(this.width-1)))
        let rand_y = Math.round((Math.random()*(this.height-1)))

        console.log("starting at:", rand_x, rand_y);
        this.uncover_tile(rand_x,rand_y)

        return;
    }

    var collapse_array = [];

    for(let num_index = 0; num_index < all_numbers.length; num_index++) {
        let num_x = all_numbers[num_index][0];
        let num_y = all_numbers[num_index][1];

        let numlist = this.get_squares_around(num_x,num_y,local_mine_field,10);
        let mine_count = local_mine_field[num_y][num_x];

        collapse_array.push([numlist, mine_count]);
    }

    this.fill_obvious(local_mine_field, all_numbers);
    this.collapse(local_mine_field, collapse_array, 0);
}


create_probability_table() {

    for(let y = 0; y < this.height; y++ ) {
        for(let x = 0; x < this.width; x++ ) {
            let mines = 0;

            let numbers_around = this.get_squares_around(x, y, this.valid_mine_fields[0], 8).length;
            
            for(let valid_index = 0; valid_index < this.valid_iterations; valid_index++) {
                if(numbers_around == 0) {
                    mines = this.valid_iterations/2;
                    break;
                }
                else if(this.valid_mine_fields[valid_index][y][x] == 9) {
                    mines++;
                }
                else if(this.valid_mine_fields[valid_index][y][x] != 10) {
                    mines=-1;
                    break;
                }
            }

            let probability = (mines/this.valid_iterations) * 100
            this.probability_table[y][x] = probability;
        }
    }
}

uncover_by_probability() {
    let something_uncovered = false;

    for(let y = 0; y < this.height; y++ ) {
        for(let x = 0; x < this.width; x++ ) {
            if(this.probability_table[y][x] < 5 && this.probability_table[y][x] > -1) {
                this.uncover_tile(x,y);

                something_uncovered = true;
            }
        }
    }

    if(something_uncovered)
        return;
    let lowest = 100;
    let coords = [0, 0];

    for(let y = 0; y < this.height; y++ ) {
        for(let x = 0; x < this.width; x++ ) {
            if(this.probability_table[y][x] < lowest && this.probability_table[y][x] >= 0) {
                lowest = this.probability_table[y][x]
                coords = [x,y]
            }
        }
    }
    console.log("best chance:", lowest);
    this.uncover_tile(coords[0], coords[1]);
}

uncover_tile(x,y){
    let selector = `${x} ${y}`;
    let square = document.getElementById(selector);
    square.click();
}

collapse(local_mine_field, collapse_array, collapse_array_index, starting_index = 0) {
    let mine_count = collapse_array[collapse_array_index][1];
    
    let tile_list = collapse_array[collapse_array_index][0];
    tile_list.forEach(tile => {
        if(local_mine_field[tile[1]][tile[0]] == 9)
            {mine_count--;}
    });
    

    if(mine_count==0) {
        collapse_array_index++;
        
        if(collapse_array_index >= collapse_array.length && this.valid(local_mine_field)) 
            {
                this.do_if_valid_iteration(local_mine_field, "x", "y", false);    
            return 1;}

        if(collapse_array_index >= collapse_array.length && !this.valid(local_mine_field)) 
            {return 0;}

        return this.collapse(local_mine_field, collapse_array, collapse_array_index);
    }
    else if(mine_count < 0) {
        return 0;
    }

    for(let tile_index = starting_index; tile_index < tile_list.length; tile_index++) {
        let tile_x = tile_list[tile_index][0];
        let tile_y = tile_list[tile_index][1];



        if(local_mine_field[tile_y][tile_x] == 9) 
            {continue;}
        
        local_mine_field[tile_y][tile_x] = 9;


        
        if(this.valid(local_mine_field)) {

            this.do_if_valid_iteration(local_mine_field, tile_x, tile_y);
            continue;
        }

        if(!this.valid_mine_counts_around_numbers(local_mine_field)) 
            {local_mine_field[tile_y][tile_x] = 10;
            continue;}

        mine_count--;
        //collapse_array[collapse_array_index][1] = mine_count;
        if(mine_count > 0){
            let valid_iteration = this.collapse(local_mine_field, collapse_array, collapse_array_index, starting_index)
            //if(valid_iteration){return 1;}

        }
        else {
            collapse_array_index++;
            
            if(collapse_array_index >= collapse_array.length && this.valid(local_mine_field)) 
                {return 1;}
            if(collapse_array_index >= collapse_array.length && !this.valid(local_mine_field)) 
                {return 0;}

            let valid_iteration = this.collapse(local_mine_field, collapse_array, collapse_array_index)
            
            //if(valid_iteration){return 1;}

            collapse_array_index--;
        }

        mine_count++;
        //collapse_array[collapse_array_index][1] = mine_count;
        local_mine_field[tile_y][tile_x] = 10;
        //Code reaches this lines only if number has corrent number of mines around
    }
    return 0;

}

do_if_valid_iteration(local_mine_field, tile_x, tile_y, revert = true) {
    let push = true;
            

    for(let i = 0; i < this.valid_mine_fields.length; i++) {

        if(this.compare_matrixes(this.valid_mine_fields[i], this.copy_matrix(local_mine_field))) {
            push = false;
        }
    }
    if(push) {
        this.valid_iterations++;
        this.valid_mine_fields.push(this.copy_matrix(local_mine_field));
    }

    if(revert) {local_mine_field[tile_y][tile_x] = 10;}
}

fill_obvious(local_mine_field, all_numbers) {
    all_numbers.forEach(num => {
        let mines_left = local_mine_field[num[1]][num[0]] - this.get_squares_around(num[0], num[1],local_mine_field,9).length;
        let empty_around = this.get_squares_around(num[0], num[1],local_mine_field,10)

        if(mines_left == empty_around.length) {
            empty_around.forEach(empty_tile => {
                let _x = empty_tile[0];
                let _y = empty_tile[1];
                local_mine_field[_y][_x] = 9;
            });
        }
    });
}

/*
extend_collapse_array(local_mine_field ,collapse_array, collapse_array_index, collapsed_table) {
    let tile_list = collapse_array[collapse_array_index][0];
    
    for(let i = 0; i<tile_list.length; i++) {
        let t_x = tile_list[i][0];
        let t_y = tile_list[i][1];

        if(local_mine_field[t_y][t_x] == 9)
            {continue;}
        
        local_mine_field[t_y][t_x] = 11;
    }

    var numbers_around = [];
    
    for(let collapsed_tile_index = 0; collapsed_tile_index < tile_list.length; collapsed_tile_index) {
        let ctx = tile_list[collapsed_tile_index][0];
        let cty = tile_list[collapsed_tile_index][1];

        let temp_numbers_around = this.get_squares_around(ctx, cty, local_mine_field, 8);

        for(let nums_around_index = 0; nums_around_index < temp_numbers_around.length; nums_around_index++) {
            let num_x = temp_numbers_around[nums_around_index][0];
            let num_y = temp_numbers_around[nums_around_index][1];

            collapsed_table[num_y][num_x] = true;
        }
    }
}

*/
/*
collapse(x,y,local_mine_field, place_table, slave = false) {
    

    let placed_mines_around = this.get_squares_around(x, y, local_mine_field, 9);


    if(!slave) {
        for(let mine_index = 0; mine_index < placed_mines_around.length; mine_index++) {
            let mine_x = placed_mines_around[mine_index][0];
            let mine_y = placed_mines_around[mine_index][1];

            if(place_table[mine_y][mine_x][0] == x && place_table[mine_y][mine_x][1] == y) {
                place_table[tile_y][tile_x] = [-1, -1]
                local_mine_field[mine_y][mine_x] = 10
            }
        }
    }


    
    let mines_to_place = local_mine_field[y][x] - placed_mines_around.length;
    if(mines_to_place == 0) 
        {return 1;}
    else if(mines_to_place < 0) 
        {return 0;}



    let empty_tiles_around = this.get_squares_around(x, y, local_mine_field, 10);

    for(let tile_index = 0; tile_index < empty_tiles_around.length; tile_index++) {
        let tile_x = empty_tiles_around[tile_index][0];
        let tile_y = empty_tiles_around[tile_index][1];

        if(local_mine_field[tile_y][tile_x] == 9) 
            {continue;}

        local_mine_field[tile_y][tile_x] = 9;
        place_table[tile_y][tile_x] = [x,y];
        mines_to_place--;

        
        console.log(this.copy_matrix(local_mine_field));


        if(!this.valid_mine_counts_around_numbers(local_mine_field)) {
            local_mine_field[tile_y][tile_x] = 10;
            place_table[tile_y][tile_x] = [-1,-1];
            mines_to_place++;
        }
        else if(mines_to_place > 0) {
            this.collapse(x, y, local_mine_field, place_table, true);
        }
        return 1;
    }

    return 0;
    
    
}

collapse_manager(local_mine_field) {
    var all_numbers = [];

    for(let y = 0; y < local_mine_field.length; y++) {
        for(let x = 0; x < local_mine_field[0].length; x++) {
            let square_value = local_mine_field[y][x];

            if(square_value >= 9 || square_value <= 0)
                continue;

            all_numbers.push([x,y, 0]);

        }
    }

    var place_table = [];

    for(let y=0; y<this.height; y++){
        let row = [];
        for(let x=0;x<this.width;x++){
            row[x]=[-1, -1];

        }
        place_table[y]=row;
    }
    
    console.log(place_table);
    //console.log(all_numbers[4]);

    let i = 0;

    while(true) {
        let success = this.collapse(all_numbers[i][0], all_numbers[i][1], local_mine_field, place_table);

        if(success)
            i++;
        else
            i--;

        if(i == all_numbers.length)
            {break;}
    }

    console.log(local_mine_field);
}
*/
/*
collapse(local_mine_field, collapse_array, clone = false) {
    depth++
    console.log("depth:", depth);
    let mines_to_place = collapse_array[1];

    collapse_array[0].forEach(coords => {
        if(local_mine_field[coords[1]][coords[0]] == 9) {
            mines_to_place--;
        }
    });

    if(mines_to_place == 0) {
        return;}
            

    for(let coords_index = 0; coords_index < collapse_array[0].length; coords_index++) {
        let x = collapse_array[0][coords_index][0];
        let y = collapse_array[0][coords_index][1];

        if(mines_to_place < 1){
            continue;
        }
            
        local_mine_field[y][x] = 9;
        mines_to_place--;
        if(!this.valid_mine_counts_around_numbers(local_mine_field)) {
            local_mine_field[y][x] = 10;
            mines_to_place++;
            continue;
        }

        console.log(this.copy_matrix(local_mine_field))

        if(mines_to_place > 0)
            {this.collapse(local_mine_field, collapse_array, true);}

            

        if(!this.valid(local_mine_field) && mines_to_place == 0)
            this.check_other_numbers(collapse_array, local_mine_field);


        if(!this.valid(local_mine_field)) {
            local_mine_field[y][x] = 10;
            mines_to_place++;
        }
        else {
            console.log("valid result:");
            console.log(this.copy_matrix(local_mine_field));
            local_mine_field[y][x] = 10;
            mines_to_place++;
            this.valid_iterations++;
        }
            
    }
}


check_other_numbers(collapse_array, local_mine_field, return_numlist = false) {
    let numlist = []

    for(let coords_index = 0; coords_index < collapse_array[0].length; coords_index++) {
        let x = collapse_array[0][coords_index][0];
        let y = collapse_array[0][coords_index][1];

        if(local_mine_field[y][x] != 9)
            local_mine_field[y][x] = 11;

            
        let new_nums_to_numlist = this.get_squares_around(x,y, local_mine_field, 8);
        let filtered_num_list = []

        for(let i = 0; i < new_nums_to_numlist.length; i++) {
            let num = new_nums_to_numlist[i];
            if(local_mine_field[num[1]][num[0]] != this.get_squares_around(num[0],num[1], local_mine_field, 9).length) {
                filtered_num_list.push(new_nums_to_numlist[i]);
                continue;
            }

            if(return_numlist)
                continue;

            let safe_covered_tiles = this.get_squares_around(num[0], num[1], local_mine_field, 10);
            safe_covered_tiles.forEach(coords => {
                if(local_mine_field[coords[1]][coords[0]] == 11)
                    return;

                local_mine_field[coords[1]][coords[0]] = 11;   
                filtered_num_list = filtered_num_list.concat(this.check_other_numbers([[coords], 0], local_mine_field, true));
            });
        }
        
        numlist = numlist.concat(filtered_num_list);
    }

    if (return_numlist)
     {return numlist;}

    var merged_numlist = [];

    for(let index = 0; index < numlist.length; index ++) {
        let already_in = false;
        for(let final_index = 0; final_index < merged_numlist.length; final_index++) {
            if(merged_numlist[final_index][0] == numlist[index][0] && merged_numlist[final_index][1] == numlist[index][1]) {
                already_in = true;
                break;
            }
        }
        if(already_in)
            {continue;}

        merged_numlist.push(numlist[index])
    }
    

    for(let number_index = 0; number_index < merged_numlist.length; number_index++) {
        let number_x = merged_numlist[number_index][0];
        let number_y = merged_numlist[number_index][1];

        let nearby_uncovered_squares = this.get_squares_around(number_x, number_y, local_mine_field, 10);
        
        if(nearby_uncovered_squares.length == 0) {
            continue;
        }
        
        let _collapse_array = [nearby_uncovered_squares, local_mine_field[number_y][number_x]]

        this.collapse(local_mine_field, _collapse_array);
    }

}
*/

valid_mine_counts_around_numbers(mine_field_to_verify) {
    var is_valid = true;

    for(let y = 0; y < mine_field_to_verify.length; y++) {
        for(let x = 0; x < mine_field_to_verify[0].length; x++) {
            let square_value = mine_field_to_verify[y][x];

            if(square_value >= 9)
                continue;

            if(square_value < this.get_squares_around(x, y, mine_field_to_verify, 9).length) {
                is_valid = false;
                break;
            }

        }
    }
    return is_valid;
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

compare_matrixes(matrix_1, matrix_2) {
    let same = true;

    for(let y = 0; y < matrix_1.length; y++ ) {
        for(let x = 0; x < matrix_1[0].length; x++ ) {
            if(matrix_1[y][x] != matrix_2[y][x]) {
                same = false;
                break;
            }
        }
        if(!same) {break;}
    }

    return same;
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
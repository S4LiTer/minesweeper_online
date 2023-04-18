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

MakeField(8, 8)
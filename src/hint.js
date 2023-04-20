class minesweeperAI {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.covered_minefield = [];

        for(let y=0; y<height; y++){
            let row = [];
            for(let x=0;x<width;x++){
                row[x]=10;
            }
            this.covered_minefield[y]=row;
        }

    }

    uncover(x, y, value) {
        this.covered_minefield[y][x] = value;

        console.log(this.covered_minefield);
    }



    predict() {
        for(let y = 0; y < this.height; y++ ) {
            
        }
    }
}
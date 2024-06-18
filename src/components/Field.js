

class Field {
    constructor(game, row, col) {

        this.row = row;
        this.col = col;


        const dark = Boolean((row + col) % 2);
        const colorStr = dark ? 'dark' : 'light';

        this.el = document.createElement('div');
        this.el.className = 'checkers-field';
        this.el.className += ` checkers-field-${colorStr}`;


        const num = row * game.config.cols + col;
        this.num = num;
        this.el.setAttribute('data-num', num);

    }

    highlight() {
        this.el.classList.add('checkers-field-highlight');
    }

    unhighlight(){
        this.el.classList.remove('checkers-field-highlight');
    }
}

export default Field;


class Field {
    constructor(game, row, col) {

        this.row = row;
        this.col = col;


        const dark = Boolean((row + col) % 2);
        const colorStr = dark ? 'dark' : 'light';

        this.el = document.createElement('div');
        this.el.className = 'checkers-field';
        this.el.className += ` checkers-field-${colorStr}`;


        const num = row * game.config.cols + col; // criação da formula onde vai armazenar a coordenada de cada indice do tabuleiro row = indice da linha cow = indice da coluna
        this.num = num;                           // o game.config.cols é onde estou definindo que o tabuleiro terá um total de 8 colunas (Que no caso é um tabuleiro 8x8)
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
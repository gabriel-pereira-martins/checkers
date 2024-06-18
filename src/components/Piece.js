import{ getColorString } from './utils';

class Piece {
    constructor(game, color) {
        this.game = game;
        this.color = color;

        const colorStr = getColorString(color);

        this.el = document.createElement('div');
        this.el.className = 'checkers-piece';
        this.el.className += ` checkers-piece-${colorStr}`;
    }

    setField(field) {
        if (this.field) {
            this.field.piece = null;
        }
        if (field){
            this.field = field;
            this.field.el.appendChild(this.el);
            field.piece = this;
            this.game.piecesByNum[field.num] = this;
        }
    }

    select() {
        this.el.classList.add('checkers-piece-selected');
        this.game.selectedPiece = this;
    }

    unselect() {
        this.el.classList.remove('checkers-piece-selected');
        if (this.game.selectedPiece === this) {
            this.game.selectedPiece = null;
        }
    }

    remove() {
        if (this.field) {
            this.field.piece = null;
            this.field = null;
        }
        this.el.parentNode.removeChild(this.el);
    }
}


export default Piece;
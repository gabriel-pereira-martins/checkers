import Field from './Field';
import Piece from './Piece';
import {DARK, LIGHT} from './consts';
import { getColorString } from './utils';

class CheckersGame {
    constructor(container, config) {

        this.container = container;
        this.config = {
            rows: 8,
            cols: 8,
            fillRows: 2,
        };

        if (config && typeof config === 'object') {
            Object.assign(this.config, config);
        };

        this.el = document.createElement('div');
        this.el.className = 'checkers-board';

        this.container.appendChild(this.el);

        this.fieldsByNum = {};
        this.piecesByNum = {};
        this.movesByNum = {};

        this.createFieldStyle();
        this.createFields();
        this.createPieces();
        this.setPlayer(LIGHT);

        this.onCurrentClick = this.playerMoveClick;
        this.el.addEventListener('click', this.onClick);
    }

    onClick = (e) => {
        this.onCurrentClick(e)
    }

    clearSelection(){
        if(this.selectedPiece) {
            this.selectedPiece.unselect();
        }
        if(this.moves) {
            this.moves.forEach((move) => {
                const field = this.getField(move.row, move.col);
                delete this.movesByNum[move.row * this.config.cols + move.col];
                field.unhighlight();
            });
            this.moves.length = 0;
        }
    }

    getNum(element) {
        while(element){
            if(element.dataset && element.dataset.num) {
                return element.dataset.num;
            }
            element = element.parentNode;
        }
        return null;
    }

    playerMoveClick(e){
        const el = e.target;
        const playerColor = getColorString(this.player);
        const fieldNum = this.getNum(el);

        if(
            //jogador atual que clicou na peça
            el.classList.contains(`checkers-piece-${playerColor}`)
        ){
            this.clearSelection();
            this.piecesByNum[fieldNum].select();
            this.highlightPossibleMoves(el.parentNode.dataset.num);
        } else if (
            // campo higlight clicado
            el.classList.contains('checkers-field-highlight')
        ) {
            //const piece = this.piecesByNum[fieldNum];
            const move = this.movesByNum[fieldNum];
            this.movePiece(this.selectedPiece, move);
            this.clearSelection();
            this.changePlayer();
        } else {
            this.clearSelection();
        }
    }

    movePiece(piece, move) {
        const { row, col, attacking } = move;
        const field = this.getField(row, col);
        piece.setField(field);

        if(attacking) {
            const attackedField = this.getField(
                attacking.row, attacking.col,
            );
            console.log('Attacking:', attacking);
            console.log('Attacked Field:', attackedField);
            const attackedPiece = attackedField.piece;
            if(attackedPiece) {
                console.log('Attacked Piece:', attackedPiece);
                attackedPiece.remove();
            };
        }
    }

    highlightPossibleMoves(fieldNum){

        const row = Math.floor(fieldNum / this.config.cols);
        const col = fieldNum % this.config.cols;
        const otherPlayer = this.player  === DARK ? LIGHT : DARK;
        const rowChange = this.player === DARK ? 1 : -1;

        const possibleRow = row + rowChange;

        const moves = [];
        [1, -1].forEach((colChange) => {

            let field = this.getField(
                possibleRow, col + colChange,
            );
            if(field){
                if(!field.piece){
                    moves.push({
                        row: possibleRow,
                        col: col + colChange,
                    });
                } else if (field.piece.color === otherPlayer) {
                    const attackRow = possibleRow + rowChange;
                    const attackCol = col + colChange * 2;
                    field = this.getField(
                        attackRow, attackCol
                    );
                    if (field && !field.piece){
                        moves.push({
                            row: attackRow,
                            col: attackCol,
                            attacking: {
                                row: possibleRow,
                                col: col + colChange,
                            },
                        });
                    }
                }
            }
        });

            moves.forEach((move) => {
                const field = this.getField (move.row, move.col);
                this.movesByNum[move.row * this.config.cols + move.col] = move;
                field.highlight();
            });

            this.moves = moves;
    }

    getField(row, col){
        if (col < 0 || col >=  this.config.cols) return null;
        return this.fieldsByNum[ row * this.config.cols + col];
    }

    createFieldStyle(){
        const { rows, cols } = this.config;
        const style = document.createElement('style');
        style.innerHTML = `
            .checkers-field {
                width: ${100 / cols }%;
                height: ${100/ rows}%;
            }
        `;

        document.head.appendChild(style);
        this.fieldStyle = style;
    }

    createFields(){
        const { rows, cols } = this.config;

        for (let row = 0; row < rows; row +=1 ) {
            for (let col = 0; col < cols; col +=1) {
                const field = new Field(this, row, col);
                this.fieldsByNum[field.num] = field;
                this.el.appendChild(field.el);
            }
        }

    }

    createPieces() {
        const {rows, cols, fillRows} = this.config;

        for (let i = 0; i < fillRows; i += 1) {
            for (let j = i % 2; j < cols; j += 2) {

                const piece = new Piece(this, DARK);
                const field = this.fieldsByNum[i * cols + j];
                piece.setField(field);
            }
        }
        for (let i = rows - fillRows; i < rows; i += 1) {
            for (let j = i % 2; j < cols; j += 2){

                const piece = new Piece(this, LIGHT);
                const field = this.fieldsByNum[i * cols + j];
                piece.setField(field);
            }
        }
    }

    setPlayer(player) {
        this.player = player;
        this.setNamespaceClass ('player', player);
    }

    changePlayer() {
        const otherPlayer = this.player === DARK ? LIGHT : DARK;
        this.setPlayer(otherPlayer);
    }

    setNamespaceClass(namespace, cls) {
        const namespaceStr = `checkers--${namespace}`;

        const className = this.el.className.split(' ')
            .filter((part) => part.indexOf(namespaceStr) !== 0)

        className.push(`${namespaceStr}_${cls}`);

        this.el.className = className.join(' ');
    }
    clear(){
        this.container.innerHTML = '';
        if (this.fieldStyle) {
            this.fieldStyle.parentNode.removeChild(this.fieldStyle);
        }
    }
}

export default CheckersGame;
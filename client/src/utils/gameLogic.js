import { blackPieces, whitePieces } from './enums';
import {
    bishopMoveEval,
    horseMoveEval,
    kingMoveEval,
    pawnMoveEval,
    queenMoveEval,
    rookMoveEval,
} from './piecesLogic';
import {
    pieceToMoveNumber,
    destinationNumber,
    pieceToMoveCharacterCode,
    destinationCharacterCode,
    pieceToMoveCharacterLetter,
    destinationCharacterLetter,
} from './pieceLocationHelpers';

export const pieceMoveAttempt = (firstClick, secondClick, piecesLocation) => {
    // prettier-ignore
    return (
    firstClick !== '' &&
    firstClick !== secondClick &&
    piecesLocation[firstClick] !== 'empty-square' &&
    !(blackPieces.includes(piecesLocation[firstClick]) && blackPieces.includes(piecesLocation[secondClick])) &&
    !(whitePieces.includes(piecesLocation[firstClick]) && whitePieces.includes(piecesLocation[secondClick])) &&
    bishopMoveEval(firstClick, secondClick, piecesLocation) &&
    horseMoveEval(firstClick, secondClick, piecesLocation) &&
    kingMoveEval(firstClick, secondClick, piecesLocation) &&
    pawnMoveEval(firstClick, secondClick, piecesLocation) &&
    queenMoveEval(firstClick, secondClick, piecesLocation) &&
    rookMoveEval(firstClick, secondClick, piecesLocation)

  );
};

export const checkChecker = (firstClick, secondClick, piecesLocation) => {
    // Create array of squares that king could move to
    // Do I need to change firstClick param? I guess it should be king location, no matter if it's clicked or not...
    // Need to run this function twice for each king...
    console.log(firstClick);
    const squaresAroundKing = [];
    // top
    if (pieceToMoveNumber(firstClick) + 1 < 9) {
        squaresAroundKing.push(
            pieceToMoveCharacterLetter(firstClick) +
                (pieceToMoveNumber(firstClick) + 1).toString()
        );
    }
    // bottom
    if (pieceToMoveNumber(firstClick) - 1 > 0) {
        squaresAroundKing.push(
            pieceToMoveCharacterLetter(firstClick) +
                (pieceToMoveNumber(firstClick) - 1).toString()
        );
    }
    // right
    // prettier-ignore
    console.log((pieceToMoveCharacterCode(firstClick)) + 1);
    // prettier-ignore
    console.log((pieceToMoveCharacterCode(firstClick)) - 1);
    // prettier-ignore
    if (pieceToMoveCharacterCode(firstClick) + 1 < 73) {
        squaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(firstClick) + 1)
                .toLowerCase() + pieceToMoveNumber(firstClick).toString()
        );
    }
    // left
    // prettier-ignore
    if (pieceToMoveCharacterCode(firstClick) - 1 > 64) {
        squaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(firstClick) - 1)
                .toLowerCase() + pieceToMoveNumber(firstClick).toString()
        );
    }

    // topLeft
    // prettier-ignore
    if (
        pieceToMoveCharacterCode(firstClick) - 1 > 64 &&
        pieceToMoveNumber(firstClick) + 1 < 9
    ) {
        squaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(firstClick) - 1)
                .toLowerCase() + (pieceToMoveNumber(firstClick) + 1).toString()
        );
    }
    // topRight
    // prettier-ignore
    if (
        pieceToMoveCharacterCode(firstClick) + 1 < 73 &&
        pieceToMoveNumber(firstClick) + 1 < 9
    ) {
        squaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(firstClick) + 1)
                .toLowerCase() + (pieceToMoveNumber(firstClick) + 1).toString()
        );
    }
    // bottomRight
    // prettier-ignore
    if (
        pieceToMoveCharacterCode(firstClick) + 1 < 73 &&
        pieceToMoveNumber(firstClick) - 1 > 0
    ) {
        squaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(firstClick) + 1)
                .toLowerCase() + (pieceToMoveNumber(firstClick) - 1).toString()
        );
    }
    // bottomLeft
    // prettier-ignore
    if (
        pieceToMoveCharacterCode(firstClick) - 1 > 64 &&
        pieceToMoveNumber(firstClick) - 1 > 0
    ) {
        squaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(firstClick) - 1)
                .toLowerCase() + (pieceToMoveNumber(firstClick) - 1).toString()
        );
    }
    console.log(squaresAroundKing);
    // Create array of squares that king could move to without moving into check
    // Can I use the existing piece logic?
    // Takes three params - firstClick, secondClick, piecesLocation
    // secondClick would be whatever piece location we are iterating on in the availableKingMovesArray
    // for firstClick, we need to get locations of each game piece
    // So each function would potentially have to be called twice, or for king/queen once, or for pawns 8 times
    const availableKingMoves = squaresAroundKing;
    for (let i = 0; i < availableKingMoves.length; i++) {
        console.log('hello');
    }

    // If the arrays are same length, checkmate and game is over
    // If second click is not included in 2nd array, return some message that you can't move into check

    // Otherwise allow the move to occur
};

export const isKingAliveEval = (piecesLocation) => {
    if (!Object.values(piecesLocation).includes('white-king')) {
        return 'blackWin';
    } else if (!Object.values(piecesLocation).includes('black-king')) {
        return 'whiteWin';
    }
};

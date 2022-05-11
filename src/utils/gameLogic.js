import { blackPieces, whitePieces } from './enums';
import {
    bishopMoveEval,
    horseMoveEval,
    kingMoveEval,
    pawnMoveEval,
    queenMoveEval,
    rookMoveEval,
} from './piecesLogic';

export const evaluateSecondClick = (
    firstClick,
    secondClick,
    piecesLocation
) => {
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

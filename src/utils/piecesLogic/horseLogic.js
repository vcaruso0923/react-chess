import {
    pieceToMoveNumber,
    destinationNumber,
    pieceToMoveCharacterCode,
    destinationCharacterCode,
    pieceToMoveCharacterLetter,
    destinationCharacterLetter,
} from '../boardCodeVariables';

export const horseMoveEval = (firstClick, secondClick, piecesLocation) => {
    if (piecesLocation[firstClick].includes('horse')) {
        // Must move in L shape
        // All evaluated
        return true;
    } else {
        return true;
    }
};

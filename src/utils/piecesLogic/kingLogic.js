import {
    pieceToMoveNumber,
    destinationNumber,
    pieceToMoveCharacterCode,
    destinationCharacterCode,
    pieceToMoveCharacterLetter,
    destinationCharacterLetter,
} from '../boardCodeVariables';

export const kingMoveEval = (firstClick, secondClick, piecesLocation) => {
    if (piecesLocation[firstClick].includes('king')) {
        // Can't move more than 1 square in any direction
        // All evaluated
        return true;
    } else {
        return true;
    }
};

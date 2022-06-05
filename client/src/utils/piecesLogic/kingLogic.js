import {
    pieceToMoveNumber,
    destinationNumber,
    pieceToMoveCharacterCode,
    destinationCharacterCode,
    pieceToMoveCharacterLetter,
    destinationCharacterLetter,
} from '../pieceLocationHelpers';

export const kingMoveEval = (firstClick, secondClick, piecesLocation) => {
    if (piecesLocation[firstClick].includes('king')) {
        // Can't move more than 1 square in any direction
        // prettier-ignore
        if (
            Math.abs(pieceToMoveNumber(firstClick) - destinationNumber(secondClick)) > 1 ||
            Math.abs(pieceToMoveCharacterCode(firstClick) - destinationCharacterCode(secondClick)) > 1
        ) {
            return false
        }
        // All evaluated
        return true;
    } else {
        return true;
    }
};

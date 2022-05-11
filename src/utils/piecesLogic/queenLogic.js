import {
    pieceToMoveNumber,
    destinationNumber,
    pieceToMoveCharacterCode,
    destinationCharacterCode,
    pieceToMoveCharacterLetter,
    destinationCharacterLetter,
} from '../boardCodeVariables';

export const queenMoveEval = (firstClick, secondClick, piecesLocation) => {
    if (piecesLocation[firstClick].includes('queen')) {
        // Can't move unless diagonal
        // Can't move unless horizontal/vertical
        // Can't move unless horsin' around
        // All evaluated
        return true;
    } else {
        return true;
    }
};

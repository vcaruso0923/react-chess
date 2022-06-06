import {
    pieceToMoveNumber,
    destinationNumber,
    pieceToMoveCharacterCode,
    destinationCharacterCode,
    pieceToMoveCharacterLetter,
    destinationCharacterLetter,
} from '../pieceLocationHelpers';

export const horseMoveEval = (firstClick, secondClick, piecesLocation) => {
    if (piecesLocation[firstClick].includes('horse')) {
        // Must move in L shape
        // up 2 right 1
        if (
            // up 2 right 1
            secondClick !==
                String.fromCharCode(
                    pieceToMoveCharacterCode(firstClick) + 1
                ).toLowerCase() +
                    (pieceToMoveNumber(firstClick) + 2).toString() &&
            // up 2, left 1
            secondClick !==
                String.fromCharCode(
                    pieceToMoveCharacterCode(firstClick) - 1
                ).toLowerCase() +
                    (pieceToMoveNumber(firstClick) + 2).toString() &&
            // up 1, right 2
            secondClick !==
                String.fromCharCode(
                    pieceToMoveCharacterCode(firstClick) + 2
                ).toLowerCase() +
                    (pieceToMoveNumber(firstClick) + 1).toString() &&
            // up 1, left 2
            secondClick !==
                String.fromCharCode(
                    pieceToMoveCharacterCode(firstClick) - 2
                ).toLowerCase() +
                    (pieceToMoveNumber(firstClick) + 1).toString() &&
            // down 2, left 1
            secondClick !==
                String.fromCharCode(
                    pieceToMoveCharacterCode(firstClick) - 1
                ).toLowerCase() +
                    (pieceToMoveNumber(firstClick) - 2).toString() &&
            // down 2, right 1
            secondClick !==
                String.fromCharCode(
                    pieceToMoveCharacterCode(firstClick) + 1
                ).toLowerCase() +
                    (pieceToMoveNumber(firstClick) - 2).toString() &&
            // down 1, right 2
            secondClick !==
                String.fromCharCode(
                    pieceToMoveCharacterCode(firstClick) + 2
                ).toLowerCase() +
                    (pieceToMoveNumber(firstClick) - 1).toString() &&
            // down 1, left 2
            secondClick !==
                String.fromCharCode(
                    pieceToMoveCharacterCode(firstClick) - 2
                ).toLowerCase() +
                    (pieceToMoveNumber(firstClick) - 1).toString()
        ) {
            return false;
        }

        // All evaluated
        return true;
    } else {
        return true;
    }
};

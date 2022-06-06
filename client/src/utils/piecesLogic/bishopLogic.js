import {
    pieceToMoveNumber,
    destinationNumber,
    pieceToMoveCharacterCode,
    destinationCharacterCode,
    pieceToMoveCharacterLetter,
    destinationCharacterLetter,
} from '../pieceLocationHelpers';

export const bishopMoveEval = (firstClick, secondClick, piecesLocation) => {
    if (piecesLocation[firstClick].includes('bishop')) {
        // Can't move unless diagonal
        if (
            Math.abs(
                pieceToMoveNumber(firstClick) - destinationNumber(secondClick)
            ) !==
            Math.abs(
                pieceToMoveCharacterCode(firstClick) -
                    destinationCharacterCode(secondClick)
            )
        ) {
            return false;
        }

        // Can't move over pieces
        // up & right
        if (
            pieceToMoveNumber(firstClick) < destinationNumber(secondClick) &&
            pieceToMoveCharacterCode(firstClick) <
                destinationCharacterCode(secondClick)
        ) {
            // prettier-ignore
            for (let i = 1 ; i < Math.abs((pieceToMoveNumber(firstClick) - destinationNumber(secondClick))) ; i++) {
                let newCode = String.fromCharCode(pieceToMoveCharacterCode(firstClick) + i).toLowerCase() + (pieceToMoveNumber(firstClick) + i).toString()
                if (piecesLocation[newCode].includes('white') || piecesLocation[newCode].includes('black')) {
                    return false
                }
            }
        }
        // up & left
        if (
            pieceToMoveNumber(firstClick) < destinationNumber(secondClick) &&
            pieceToMoveCharacterCode(firstClick) >
                destinationCharacterCode(secondClick)
        ) {
            // prettier-ignore
            for (let i = 1 ; i < Math.abs((pieceToMoveNumber(firstClick) - destinationNumber(secondClick))) ; i++) {
                let newCode = String.fromCharCode(pieceToMoveCharacterCode(firstClick) - i).toLowerCase() + (pieceToMoveNumber(firstClick) + i).toString()
                if (piecesLocation[newCode].includes('white') || piecesLocation[newCode].includes('black')) {
                    return false
                }
            }
        }
        // down & left
        if (
            pieceToMoveNumber(firstClick) > destinationNumber(secondClick) &&
            pieceToMoveCharacterCode(firstClick) >
                destinationCharacterCode(secondClick)
        ) {
            // prettier-ignore
            for (let i = 1 ; i < Math.abs((pieceToMoveNumber(firstClick) - destinationNumber(secondClick))) ; i++) {
                let newCode = String.fromCharCode(pieceToMoveCharacterCode(firstClick) - i).toLowerCase() + (pieceToMoveNumber(firstClick) - i).toString()
                if (piecesLocation[newCode].includes('white') || piecesLocation[newCode].includes('black')) {
                    return false
                }
            }
        }
        // down & right
        if (
            pieceToMoveNumber(firstClick) > destinationNumber(secondClick) &&
            pieceToMoveCharacterCode(firstClick) <
                destinationCharacterCode(secondClick)
        ) {
            // prettier-ignore
            for (let i = 1 ; i < Math.abs((pieceToMoveNumber(firstClick) - destinationNumber(secondClick))) ; i++) {
                let newCode = String.fromCharCode(pieceToMoveCharacterCode(firstClick) + i).toLowerCase() + (pieceToMoveNumber(firstClick) - i).toString()
                if (piecesLocation[newCode].includes('white') || piecesLocation[newCode].includes('black')) {
                    return false
                }
            }
        }
        // All evaluated
        return true;
    } else {
        return true;
    }
};

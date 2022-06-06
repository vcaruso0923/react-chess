import {
    pieceToMoveNumber,
    destinationNumber,
    pieceToMoveCharacterCode,
    destinationCharacterCode,
    pieceToMoveCharacterLetter,
    destinationCharacterLetter,
} from '../pieceLocationHelpers';

export const queenMoveEval = (firstClick, secondClick, piecesLocation) => {
    if (piecesLocation[firstClick].includes('queen')) {
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
            // Can't move unless horizontal/vertical
            if (
                pieceToMoveNumber(firstClick) !==
                    destinationNumber(secondClick) &&
                destinationCharacterLetter(secondClick) !==
                    pieceToMoveCharacterLetter(firstClick)
            ) {
                return false;
            }
        }

        // Can't move over pieces
        // Diagonals
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
                let newCode = String.fromCharCode(pieceToMoveCharacterCode(firstClick).toLowerCase() - i) + (pieceToMoveNumber(firstClick) - i).toString()
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

        // Horizontal / Vertical
        // Can't move over pieces horizontally
        if (pieceToMoveNumber(firstClick) === destinationNumber(secondClick)) {
            // moving left
            // prettier-ignore
            if (destinationCharacterCode(secondClick) < pieceToMoveCharacterCode(firstClick)) {
                for (let i = (destinationCharacterCode(secondClick) + 1) ; i < pieceToMoveCharacterCode(firstClick) ; i++) {
                    let newCode = String.fromCharCode(i).toLowerCase() + firstClick.slice(-1)
                    if (piecesLocation[newCode].includes('white') || piecesLocation[newCode].includes('black')) {
                        return false
                    }
                }
            }
            // moving right
            // prettier-ignore
            if (pieceToMoveCharacterCode(firstClick) < destinationCharacterCode(secondClick)) {
                for (let i = (pieceToMoveCharacterCode(firstClick) + 1) ; i < destinationCharacterCode(secondClick) ; i++) {
                    let newCode = String.fromCharCode(i).toLowerCase() + firstClick.slice(-1)
                    if (piecesLocation[newCode].includes('white') || piecesLocation[newCode].includes('black')) {
                        return false
                    }
                }
            }
        }

        // Can't move over pieces vertically
        if (
            pieceToMoveCharacterCode(firstClick) ===
            destinationCharacterCode(secondClick)
        ) {
            console.log('vert');
            // moving down
            // prettier-ignore
            if (destinationNumber(secondClick) < pieceToMoveNumber(firstClick)) {
                for (let i = (destinationNumber(secondClick) + 1) ; i < pieceToMoveNumber(firstClick) ; i++) {
                    let newCode = pieceToMoveCharacterLetter(firstClick) + i.toString()
                    if (piecesLocation[newCode].includes('white') || piecesLocation[newCode].includes('black')) {
                        return false
                    }
                }
            }
            // moving up
            // prettier-ignore
            if (pieceToMoveNumber(firstClick) < destinationNumber(secondClick)) {
                for (let i = (pieceToMoveNumber(firstClick) + 1) ; i < destinationNumber(secondClick) ; i++) {
                    let newCode = pieceToMoveCharacterLetter(firstClick) + i.toString()
                    if (piecesLocation[newCode].includes('white') || piecesLocation[newCode].includes('black')) {
                        return false
                    }
                }
            }
        }
        // All evaluated
        return true;
    } else {
        return true;
    }
};

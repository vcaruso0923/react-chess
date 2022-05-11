import {
    pieceToMoveNumber,
    destinationNumber,
    pieceToMoveCharacterCode,
    destinationCharacterCode,
    pieceToMoveCharacterLetter,
    destinationCharacterLetter,
} from '../boardCodeVariables';

export const pawnMoveEval = (firstClick, secondClick, piecesLocation) => {
    if (piecesLocation[firstClick].includes('pawn')) {
        // White pawn moving restrictions
        if (piecesLocation[firstClick].includes('white-pawn')) {
            // Can't move backwards
            if (
                pieceToMoveNumber(firstClick) > destinationNumber(secondClick)
            ) {
                return false;
            }

            // Can't move more than one row
            if (
                firstClick.slice(-1) !== '2' &&
                destinationNumber(secondClick) - pieceToMoveNumber(firstClick) >
                    1
            ) {
                return false;
            }

            // Can't move more than two rows on first move
            if (
                firstClick.slice(-1) === '2' &&
                destinationNumber(secondClick) - pieceToMoveNumber(firstClick) >
                    2
            ) {
                return false;
            }

            // Can't move sideways
            if (
                destinationNumber(secondClick) -
                    pieceToMoveNumber(firstClick) ===
                0
            ) {
                return false;
            }

            // Can't take enemy piece unless diagonal
            if (
                (piecesLocation[secondClick].includes('black') ||
                    piecesLocation[secondClick].includes('white')) &&
                destinationCharacterLetter(secondClick) ===
                    pieceToMoveCharacterLetter(firstClick)
            ) {
                return false;
            }

            // Can't move diagonal without enemy present
            if (
                destinationCharacterLetter(secondClick) !==
                    pieceToMoveCharacterLetter(firstClick) &&
                !piecesLocation[secondClick].includes('black')
            ) {
                return false;
            }

            // Can't move diaganol more that one square left or right
            if (
                Math.abs(
                    pieceToMoveCharacterCode(firstClick) -
                        destinationCharacterCode(secondClick)
                ) > 1
            ) {
                return false;
            }

            // Can't move diagonal on first move if moving two squares
            if (
                Math.abs(
                    pieceToMoveCharacterCode(firstClick) -
                        destinationCharacterCode(secondClick)
                ) > 0 &&
                destinationNumber(secondClick) - pieceToMoveNumber(firstClick) >
                    1
            ) {
                return false;
            }

            // Can't go through pieces
            if (
                (destinationNumber(secondClick) -
                    pieceToMoveNumber(firstClick) >
                    1 &&
                    piecesLocation[
                        pieceToMoveCharacterLetter(firstClick) +
                            (Number(firstClick.slice(-1)) + 1)
                    ].includes('white')) ||
                piecesLocation[
                    pieceToMoveCharacterLetter(firstClick) +
                        (Number(firstClick.slice(-1)) + 1)
                ].includes('black')
            ) {
                return false;
            }
            // All evaluated
            return true;
            // Black pawn moving restrictions
        } else if (piecesLocation[firstClick].includes('black-pawn')) {
            // Can't move backwards
            if (
                pieceToMoveNumber(firstClick) < destinationNumber(secondClick)
            ) {
                return false;
            }
            // Can't move more than one row
            if (
                firstClick.slice(-1) !== '7' &&
                pieceToMoveNumber(firstClick) - destinationNumber(secondClick) >
                    1
            ) {
                return false;
            }
            // Can't move more than two rows on first move
            if (
                firstClick.slice(-1) === '7' &&
                pieceToMoveNumber(firstClick) - destinationNumber(secondClick) >
                    2
            ) {
                return false;
            }
            // Can't move sideways
            if (
                destinationNumber(secondClick) -
                    pieceToMoveNumber(firstClick) ===
                0
            ) {
                return false;
            }
            // Can't take enemy piece unless diagonal
            if (
                (piecesLocation[secondClick].includes('black') ||
                    piecesLocation[secondClick].includes('white')) &&
                destinationCharacterLetter(secondClick) ===
                    pieceToMoveCharacterLetter(firstClick)
            ) {
                return false;
            }
            // Can't move diagonal without enemy present
            if (
                destinationCharacterLetter(secondClick) !==
                    pieceToMoveCharacterLetter(firstClick) &&
                !piecesLocation[secondClick].includes('white')
            ) {
                return false;
            }
            // Can't move diaganol more that one square left or right
            if (
                Math.abs(
                    pieceToMoveCharacterCode(firstClick) -
                        destinationCharacterCode(secondClick)
                ) > 1
            ) {
                return false;
            }

            // Can't move diagonal on first move if moving two squares
            if (
                Math.abs(
                    pieceToMoveCharacterCode(firstClick) -
                        destinationCharacterCode(secondClick)
                ) > 0 &&
                pieceToMoveNumber(firstClick) - destinationNumber(secondClick) >
                    1
            ) {
                return false;
            }

            // Can't go through pieces
            if (
                (pieceToMoveNumber(firstClick) -
                    destinationNumber(secondClick) >
                    1 &&
                    piecesLocation[
                        pieceToMoveCharacterLetter(firstClick) +
                            (Number(firstClick.slice(-1)) - 1)
                    ].includes('white')) ||
                piecesLocation[
                    pieceToMoveCharacterLetter(firstClick) +
                        (Number(firstClick.slice(-1)) - 1)
                ].includes('black')
            ) {
                return false;
            }

            // All evaluated
            return true;
        }
    } else {
        return true;
    }
};

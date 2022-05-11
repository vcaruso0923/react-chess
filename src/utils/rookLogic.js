import {
    pieceToMoveNumber,
    destinationNumber,
    pieceToMoveCharacterCode,
    destinationCharacterCode,
    pieceToMoveCharacterLetter,
    destinationCharacterLetter,
} from './boardCodeVariables';

export const rookMoveEval = (firstClick, secondClick, piecesLocation) => {
    if (piecesLocation[firstClick].includes('rook')) {
        // Can't move diagonal
        if (
            pieceToMoveNumber(firstClick) !== destinationNumber(secondClick) &&
            destinationCharacterLetter(secondClick) !==
                pieceToMoveCharacterLetter(firstClick)
        ) {
            return false;
        }
        // Can't move over pieces horizontally
        if (pieceToMoveNumber(firstClick) === destinationNumber(secondClick)) {
            // moving left
            // prettier-ignore
            if (destinationCharacterCode(secondClick) < pieceToMoveCharacterCode(firstClick)) {
            for (let i = (destinationCharacterCode(secondClick) + 1) ; i < pieceToMoveCharacterCode(firstClick) ; i++) {
                let newCode = String.fromCharCode(i) + firstClick.slice(-1)
                if (piecesLocation[newCode].includes('white') || piecesLocation[newCode].includes('black')) {
                    return false
                }
            }
        }
            // moving right
            // prettier-ignore
            if (pieceToMoveCharacterCode(firstClick) < destinationCharacterCode(secondClick)) {
          for (let i = (pieceToMoveCharacterCode(firstClick) + 1) ; i < destinationCharacterCode(secondClick) ; i++) {
              let newCode = String.fromCharCode(i) + firstClick.slice(-1)
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

        // Can't take friendly pieces
        if (
            (piecesLocation[firstClick].includes('white') &&
                piecesLocation[secondClick].includes('white')) ||
            (piecesLocation[firstClick].includes('black') &&
                piecesLocation[secondClick].includes('black'))
        ) {
            return false;
        }
        // All evaluated
        return true;
    } else {
        return true;
    }
};

import { blackPieces, whitePieces } from './enums';
import {
    bishopMoveEval,
    horseMoveEval,
    kingMoveEval,
    pawnMoveEval,
    queenMoveEval,
    rookMoveEval,
} from './piecesLogic';
import {
    pieceToMoveNumber,
    destinationNumber,
    pieceToMoveCharacterCode,
    destinationCharacterCode,
    pieceToMoveCharacterLetter,
    destinationCharacterLetter,
} from './pieceLocationHelpers';

export const pieceMoveAttempt = (firstClick, secondClick, piecesLocation) => {
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

export const checkChecker = (
    firstClick,
    secondClick,
    piecesLocation,
    kingColor
) => {
    // Create array of squares that king could move to
    // Change firstClick param to be king location, no matter if it's clicked or not
    firstClick = Object.keys(piecesLocation).find(
        (key) => piecesLocation[key] === `${kingColor}-king`
    );
    // Need to run this function twice for each king...
    const squaresAroundKing = [];
    const friendliesAroundKing = [];
    // top
    if (pieceToMoveNumber(firstClick) + 1 < 9) {
        squaresAroundKing.push(
            pieceToMoveCharacterLetter(firstClick) +
                (pieceToMoveNumber(firstClick) + 1).toString()
        );
    }
    // bottom
    if (pieceToMoveNumber(firstClick) - 1 > 0) {
        squaresAroundKing.push(
            pieceToMoveCharacterLetter(firstClick) +
                (pieceToMoveNumber(firstClick) - 1).toString()
        );
    }
    // right
    // prettier-ignore
    if (pieceToMoveCharacterCode(firstClick) + 1 < 73) {
        squaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(firstClick) + 1)
                .toLowerCase() + pieceToMoveNumber(firstClick).toString()
        );
    }
    // left
    // prettier-ignore
    if (pieceToMoveCharacterCode(firstClick) - 1 > 64) {
        squaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(firstClick) - 1)
                .toLowerCase() + pieceToMoveNumber(firstClick).toString()
        );
    }

    // topLeft
    // prettier-ignore
    if (
        pieceToMoveCharacterCode(firstClick) - 1 > 64 &&
        pieceToMoveNumber(firstClick) + 1 < 9
    ) {
        squaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(firstClick) - 1)
                .toLowerCase() + (pieceToMoveNumber(firstClick) + 1).toString()
        );
    }
    // topRight
    // prettier-ignore
    if (
        pieceToMoveCharacterCode(firstClick) + 1 < 73 &&
        pieceToMoveNumber(firstClick) + 1 < 9
    ) {
        squaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(firstClick) + 1)
                .toLowerCase() + (pieceToMoveNumber(firstClick) + 1).toString()
        );
    }
    // bottomRight
    // prettier-ignore
    if (
        pieceToMoveCharacterCode(firstClick) + 1 < 73 &&
        pieceToMoveNumber(firstClick) - 1 > 0
    ) {
        squaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(firstClick) + 1)
                .toLowerCase() + (pieceToMoveNumber(firstClick) - 1).toString()
        );
    }
    // bottomLeft
    // prettier-ignore
    if (
        pieceToMoveCharacterCode(firstClick) - 1 > 64 &&
        pieceToMoveNumber(firstClick) - 1 > 0
    ) {
        squaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(firstClick) - 1)
                .toLowerCase() + (pieceToMoveNumber(firstClick) - 1).toString()
        );
    }

    // remove squares from the array if they are the same color as the king
    for (let i = 0; i < squaresAroundKing.length; i++) {
        if (piecesLocation[squaresAroundKing[i]].includes(kingColor)) {
            squaresAroundKing.splice(i, 1);
            friendliesAroundKing.push(squaresAroundKing[i]);
        }
    }

    // Create arrays representing enemy piece location
    const opponentColor = kingColor === 'white' ? 'black' : 'white';
    let oppPawnArray = [];
    let oppRookArray = [];
    let oppBishopArray = [];
    let oppHorseArray = [];
    let oppQueenArray = [];
    let oppKingArray = [];

    for (const square in piecesLocation) {
        if (piecesLocation[square].includes(kingColor + '-pawn')) {
            oppPawnArray.push(square);
        } else if (piecesLocation[square].includes(kingColor + '-rook')) {
            oppRookArray.push(square);
        } else if (piecesLocation[square].includes(kingColor + '-bishop')) {
            oppBishopArray.push(square);
        } else if (piecesLocation[square].includes(kingColor + '-horse')) {
            oppHorseArray.push(square);
        } else if (piecesLocation[square].includes(kingColor + '-queen')) {
            oppQueenArray.push(square);
        } else if (piecesLocation[square].includes(kingColor + '-rook')) {
            oppKingArray.push(square);
        }
    }

    // Create array of squares that king could move to without moving into check
    // Lets use the existing 'piecesLogic'
    // Takes three params - firstClick, secondClick, piecesLocation
    // If the evals returns true, we know that piece can move to the square
    // firstClick will be a square from the location arrays we just created
    // secondClick would be whatever piece location we are iterating on in the availableKingMovesArray
    const availableKingMoves = squaresAroundKing;
    console.log(squaresAroundKing);
    if (squaresAroundKing.length > 0) {
        for (let i = 0; i < squaresAroundKing.length; i++) {
            for (let j = 0; j < oppPawnArray.length; j++) {
                if (
                    pawnMoveEval(
                        oppPawnArray[j],
                        squaresAroundKing[i],
                        piecesLocation
                    ) === true &&
                    availableKingMoves.includes(squaresAroundKing[i])
                ) {
                    availableKingMoves.splice(availableKingMoves[i], 1);
                }
            }
            for (let k = 0; k < oppRookArray.length; k++) {
                if (
                    rookMoveEval(
                        oppRookArray[k],
                        squaresAroundKing[i],
                        piecesLocation
                    ) === true &&
                    availableKingMoves.includes(squaresAroundKing[i])
                ) {
                    availableKingMoves.splice(availableKingMoves[i], 1);
                }
            }
            for (let l = 0; l < oppBishopArray.length; l++) {
                if (
                    bishopMoveEval(
                        oppBishopArray[l],
                        squaresAroundKing[i],
                        piecesLocation
                    ) === true &&
                    availableKingMoves.includes(squaresAroundKing[i])
                ) {
                    availableKingMoves.splice(availableKingMoves[i], 1);
                }
            }
            for (let m = 0; m < oppHorseArray.length; m++) {
                if (
                    horseMoveEval(
                        oppHorseArray[m],
                        squaresAroundKing[i],
                        piecesLocation
                    ) === true &&
                    availableKingMoves.includes(squaresAroundKing[i])
                ) {
                    availableKingMoves.splice(availableKingMoves[i], 1);
                }
            }
            for (let n = 0; n < oppQueenArray.length; n++) {
                console.log(n);
                if (
                    queenMoveEval(
                        oppQueenArray[n],
                        squaresAroundKing[i],
                        piecesLocation
                    ) === true &&
                    availableKingMoves.includes(squaresAroundKing[i])
                ) {
                    availableKingMoves.splice(availableKingMoves[i], 1);
                }
            }
            for (let o = 0; o < oppKingArray.length; o++) {
                if (
                    kingMoveEval(
                        oppKingArray[o],
                        squaresAroundKing[i],
                        piecesLocation
                    ) === true &&
                    availableKingMoves.includes(squaresAroundKing[i])
                ) {
                    availableKingMoves.splice(availableKingMoves[i], 1);
                }
            }
        }
    }

    // If the arrays are same length, checkmate and game is over
    if (
        friendliesAroundKing.length < 1 &&
        squaresAroundKing === availableKingMoves
    ) {
        return `checkmate-${opponentColor}-wins`;
    }
    // If second click is not included in 2nd array, return some message that you can't move into check
    if (!availableKingMoves.includes(secondClick)) {
        return `cannot-move-into-check`;
    }
    // Otherwise allow the move to occur
    return `move-okay`;
};

export const isKingAliveEval = (piecesLocation) => {
    if (!Object.values(piecesLocation).includes('white-king')) {
        return 'blackWin';
    } else if (!Object.values(piecesLocation).includes('black-king')) {
        return 'whiteWin';
    }
};

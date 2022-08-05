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

export { castleMoveEval } from './specialMovesLogic';

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
    const kingLocation = Object.keys(piecesLocation).find(
        (key) => piecesLocation[key] === `${kingColor}-king`
    );

    // Need to run this function twice for each king...
    const allSquaresAroundKing = [];
    const friendliesAroundKing = [];
    // top
    if (pieceToMoveNumber(kingLocation) + 1 < 9) {
        allSquaresAroundKing.push(
            pieceToMoveCharacterLetter(kingLocation) +
                (pieceToMoveNumber(kingLocation) + 1).toString()
        );
    }
    // bottom
    if (pieceToMoveNumber(kingLocation) - 1 > 0) {
        allSquaresAroundKing.push(
            pieceToMoveCharacterLetter(kingLocation) +
                (pieceToMoveNumber(kingLocation) - 1).toString()
        );
    }
    // right
    // prettier-ignore
    if (pieceToMoveCharacterCode(kingLocation) + 1 < 73) {
        allSquaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(kingLocation) + 1)
                .toLowerCase() + pieceToMoveNumber(kingLocation).toString()
        );
    }
    // left
    // prettier-ignore
    if (pieceToMoveCharacterCode(kingLocation) - 1 > 64) {
        allSquaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(kingLocation) - 1)
                .toLowerCase() + pieceToMoveNumber(kingLocation).toString()
        );
    }

    // topLeft
    // prettier-ignore
    if (
        pieceToMoveCharacterCode(kingLocation) - 1 > 64 &&
        pieceToMoveNumber(kingLocation) + 1 < 9
    ) {
        allSquaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(kingLocation) - 1)
                .toLowerCase() + (pieceToMoveNumber(kingLocation) + 1).toString()
        );
    }
    // topRight
    // prettier-ignore
    if (
        pieceToMoveCharacterCode(kingLocation) + 1 < 73 &&
        pieceToMoveNumber(kingLocation) + 1 < 9
    ) {
        allSquaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(kingLocation) + 1)
                .toLowerCase() + (pieceToMoveNumber(kingLocation) + 1).toString()
        );
    }
    // bottomRight
    // prettier-ignore
    if (
        pieceToMoveCharacterCode(kingLocation) + 1 < 73 &&
        pieceToMoveNumber(kingLocation) - 1 > 0
    ) {
        allSquaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(kingLocation) + 1)
                .toLowerCase() + (pieceToMoveNumber(kingLocation) - 1).toString()
        );
    }
    // bottomLeft
    // prettier-ignore
    if (
        pieceToMoveCharacterCode(kingLocation) - 1 > 64 &&
        pieceToMoveNumber(kingLocation) - 1 > 0
    ) {
        allSquaresAroundKing.push(
            String.fromCharCode(pieceToMoveCharacterCode(kingLocation) - 1)
                .toLowerCase() + (pieceToMoveNumber(kingLocation) - 1).toString()
        );
    }

    const squaresAroundKingNoFriendlies = [...allSquaresAroundKing];

    console.log(allSquaresAroundKing);

    // remove squares from the array if they are the same color as the king
    for (let i = 0; i < allSquaresAroundKing.length; i++) {
        if (piecesLocation[allSquaresAroundKing[i]].includes(kingColor)) {
            const index = squaresAroundKingNoFriendlies.indexOf(
                piecesLocation[allSquaresAroundKing[i]]
            );
            squaresAroundKingNoFriendlies.splice(index, 1);
            friendliesAroundKing.push(allSquaresAroundKing[i]);
        }
    }

    console.log(squaresAroundKingNoFriendlies);

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
    const availableKingMoves = [...squaresAroundKingNoFriendlies];

    if (squaresAroundKingNoFriendlies.length > 0) {
        for (let i = 0; i < squaresAroundKingNoFriendlies.length; i++) {
            for (let j = 0; j < oppPawnArray.length; j++) {
                if (
                    pawnMoveEval(
                        oppPawnArray[j],
                        squaresAroundKingNoFriendlies[i],
                        piecesLocation
                    ) === true &&
                    availableKingMoves.includes(
                        squaresAroundKingNoFriendlies[i]
                    )
                ) {
                    availableKingMoves.splice(availableKingMoves[i], 1);
                }
            }
            for (let k = 0; k < oppRookArray.length; k++) {
                if (
                    rookMoveEval(
                        oppRookArray[k],
                        squaresAroundKingNoFriendlies[i],
                        piecesLocation
                    ) === true &&
                    availableKingMoves.includes(
                        squaresAroundKingNoFriendlies[i]
                    )
                ) {
                    availableKingMoves.splice(availableKingMoves[i], 1);
                }
            }
            for (let l = 0; l < oppBishopArray.length; l++) {
                if (
                    bishopMoveEval(
                        oppBishopArray[l],
                        squaresAroundKingNoFriendlies[i],
                        piecesLocation
                    ) === true &&
                    availableKingMoves.includes(
                        squaresAroundKingNoFriendlies[i]
                    )
                ) {
                    availableKingMoves.splice(availableKingMoves[i], 1);
                }
            }
            for (let m = 0; m < oppHorseArray.length; m++) {
                if (
                    horseMoveEval(
                        oppHorseArray[m],
                        squaresAroundKingNoFriendlies[i],
                        piecesLocation
                    ) === true &&
                    availableKingMoves.includes(
                        squaresAroundKingNoFriendlies[i]
                    )
                ) {
                    availableKingMoves.splice(availableKingMoves[i], 1);
                }
            }
            for (let n = 0; n < oppQueenArray.length; n++) {
                if (
                    queenMoveEval(
                        oppQueenArray[n],
                        squaresAroundKingNoFriendlies[i],
                        piecesLocation
                    ) === true &&
                    availableKingMoves.includes(
                        squaresAroundKingNoFriendlies[i]
                    )
                ) {
                    availableKingMoves.splice(availableKingMoves[i], 1);
                }
            }
            for (let o = 0; o < oppKingArray.length; o++) {
                if (
                    kingMoveEval(
                        oppKingArray[o],
                        squaresAroundKingNoFriendlies[i],
                        piecesLocation
                    ) === true &&
                    availableKingMoves.includes(
                        squaresAroundKingNoFriendlies[i]
                    )
                ) {
                    availableKingMoves.splice(availableKingMoves[i], 1);
                }
            }
        }
    }

    // If the arrays are same length, checkmate and game is over
    if (
        friendliesAroundKing.length < 1 &&
        squaresAroundKingNoFriendlies === availableKingMoves
    ) {
        return `checkmate-${opponentColor}-wins`;
    }
    // If second click is not included in 2nd array, return some message that you can't move into check
    if (
        availableKingMoves.includes(secondClick) &&
        firstClick === kingLocation &&
        secondClick !== kingLocation
    ) {
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

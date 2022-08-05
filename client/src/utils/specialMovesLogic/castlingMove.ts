import {
    pieceToMoveNumber,
    destinationNumber,
    pieceToMoveCharacterCode,
    destinationCharacterCode,
    pieceToMoveCharacterLetter,
    destinationCharacterLetter,
} from '../pieceLocationHelpers';

export const castleMoveEval = (firstClick, secondClick, piecesLocation, kingMoved, kingSideRookMoved, queenSideRookMoved) => {
    if (piecesLocation[firstClick].includes('king')) {
        // white player castling
        if (piecesLocation[firstClick].includes('white')) {
            // king side
            if (!kingMoved && !kingSideRookMoved && piecesLocation['f1'] === 'empty-square' && piecesLocation['g1'] === 'empty-square') {
                return 'white-king-side-castle';
            }

            // queen side
            if (!kingMoved && !queenSideRookMoved && piecesLocation['b1'] === 'empty-square' && piecesLocation['c1'] === 'empty-square' && piecesLocation['d1'] === 'empty-square') {
                return 'white-queen-side-castle';
            }
        }
        // black player castling
        if (piecesLocation[firstClick].includes('black')) {
            // king side
            if (!kingMoved && !kingSideRookMoved && piecesLocation['f8'] === 'empty-square' && piecesLocation['g8'] === 'empty-square') {
                return 'black-king-side-castle';
            }

            // queen side
            if (!kingMoved && !queenSideRookMoved && piecesLocation['b1'] === 'empty-square' && piecesLocation['c1'] === 'empty-square' && piecesLocation['d1'] === 'empty-square') {
                return 'black-queen-side-castle';
            }
        }
    } else {
        return false
    }
}
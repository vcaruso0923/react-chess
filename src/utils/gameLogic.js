import { blackPieces, whitePieces } from './enums';
import { pawnMoveEval } from './pawnLogic';
import { rookMoveEval } from './rookLogic';

const bishopMoveEval = (firstClick, secondClick, piecesLocation) => {
  if (piecesLocation[firstClick].includes('bishop')) {
    // Can't move unless diagonal
    // Can't move over pieces
    // Can't take friendly pieces
  } else {
    return true;
  }
};
const horseMoveEval = (firstClick, secondClick, piecesLocation) => {
  if (piecesLocation[firstClick].includes('horse')) {
    // Must move in L shape
    // Can't take friendly pieces
  } else {
    return true;
  }
};
const queenMoveEval = (firstClick, secondClick, piecesLocation) => {
  if (piecesLocation[firstClick].includes('queen')) {
    // Can't move unless diagonal
    // Can't move unless horizontal/vertical
    // Can't move unless horsin' around
    // Can't take friendly pieces
  } else {
    return true;
  }
};
const kingMoveEval = (firstClick, secondClick, piecesLocation) => {
  if (piecesLocation[firstClick].includes('king')) {
    // Can't move more than 1 square in any direction
    // Can't take friendly pieces
  } else {
    return true;
  }
};

export const evaluateSecondClick = (
  firstClick,
  secondClick,
  piecesLocation
) => {
  // prettier-ignore
  return (
    firstClick !== '' &&
    firstClick !== secondClick &&
    piecesLocation[firstClick] !== 'empty-square' &&
    !(blackPieces.includes(piecesLocation[firstClick]) && blackPieces.includes(piecesLocation[secondClick])) &&
    !(whitePieces.includes(piecesLocation[firstClick]) && whitePieces.includes(piecesLocation[secondClick])) &&
    pawnMoveEval(firstClick, secondClick, piecesLocation) &&
    rookMoveEval(firstClick, secondClick, piecesLocation)
  );
};

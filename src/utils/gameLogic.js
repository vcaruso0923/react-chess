import { blackPieces, whitePieces } from './enums';
import { pawnMoveEval } from './pawnLogic';

const rookMoveEval = (firstClick, secondClick, piecesLocation) => {
  if (piecesLocation[firstClick].includes('rook')) {
  } else {
    return true;
  }
};
const bishopMoveEval = (firstClick, secondClick, piecesLocation) => {
  if (piecesLocation[firstClick].includes('bishop')) {
  } else {
    return true;
  }
};
const horseMoveEval = (firstClick, secondClick, piecesLocation) => {
  if (piecesLocation[firstClick].includes('horse')) {
  } else {
    return true;
  }
};
const queenMoveEval = (firstClick, secondClick, piecesLocation) => {
  if (piecesLocation[firstClick].includes('queen')) {
  } else {
    return true;
  }
};
const kingMoveEval = (firstClick, secondClick, piecesLocation) => {
  if (piecesLocation[firstClick].includes('king')) {
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
    pawnMoveEval(firstClick, secondClick, piecesLocation)
  );
};

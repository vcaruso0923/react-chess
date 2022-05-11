export const pieceToMoveNumber = (firstClick) => {
  return parseInt(firstClick.slice(-1));
};
export const destinationNumber = (secondClick) => {
  return parseInt(secondClick.slice(-1));
};
export const pieceToMoveCharacterCode = (firstClick) => {
  return firstClick.charCodeAt(0);
};
export const destinationCharacterCode = (secondClick) => {
  return secondClick.charCodeAt(0);
};
export const pieceToMoveCharacterLetter = (firstClick) => {
  return firstClick.charAt(0);
};
export const destinationCharacterLetter = (secondClick) => {
  return secondClick.charAt(0);
};

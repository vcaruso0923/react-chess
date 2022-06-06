// Piece locations are defined by a combination of letter and numbers, for example a1.
// These functions are used to get information about the piece location.
// I could have used an array for piece locations, for example ['a', '1'] but it's too late to go back.

export const pieceToMoveNumber = (firstClick) => {
    return parseInt(firstClick.slice(-1));
};
export const destinationNumber = (secondClick) => {
    return parseInt(secondClick.slice(-1));
};
export const pieceToMoveCharacterCode = (firstClick) => {
    const temp = firstClick.charAt(0).toUpperCase();
    return temp.charCodeAt(0);
};
export const destinationCharacterCode = (secondClick) => {
    const temp = secondClick.charAt(0).toUpperCase();
    return temp.charCodeAt(0);
};
export const pieceToMoveCharacterLetter = (firstClick) => {
    return firstClick.charAt(0);
};
export const destinationCharacterLetter = (secondClick) => {
    return secondClick.charAt(0);
};

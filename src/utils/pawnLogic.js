export const pawnMoveEval = (firstClick, secondClick, piecesLocation) => {
  if (piecesLocation[firstClick].includes('pawn')) {
    // White pawn moving restrictions
    if (piecesLocation[firstClick].includes('white-pawn')) {
      // Can't move backwards
      if (parseInt(firstClick.slice(-1)) > parseInt(secondClick.slice(-1))) {
        return false;
      }

      // Can't move more than one row
      if (
        firstClick.slice(-1) !== '2' &&
        parseInt(secondClick.slice(-1)) - parseInt(firstClick.slice(-1)) > 1
      ) {
        return false;
      }

      // Can't move more than two rows on first move
      if (
        firstClick.slice(-1) === '2' &&
        parseInt(secondClick.slice(-1)) - parseInt(firstClick.slice(-1)) > 2
      ) {
        return false;
      }

      // Can't move sideways
      if (
        parseInt(secondClick.slice(-1)) - parseInt(firstClick.slice(-1)) ===
        0
      ) {
        return false;
      }

      // Can't take enemy piece unless diagonal
      if (
        (piecesLocation[secondClick].includes('black') ||
          piecesLocation[secondClick].includes('white')) &&
        secondClick.charAt(0) === firstClick.charAt(0)
      ) {
        return false;
      }

      // Can't move diagonal without enemy present
      if (
        secondClick.charAt(0) !== firstClick.charAt(0) &&
        !piecesLocation[secondClick].includes('black')
      ) {
        return false;
      }

      // Can't move diaganol more that one square left or right
      if (Math.abs(firstClick.charCodeAt(0) - secondClick.charCodeAt(0)) > 1) {
        return false;
      }

      // Can't move diagonal on first move if moving two squares
      if (
        Math.abs(firstClick.charCodeAt(0) - secondClick.charCodeAt(0)) > 0 &&
        parseInt(secondClick.slice(-1)) - parseInt(firstClick.slice(-1)) > 1
      ) {
        return false;
      }

      // Can't go through pieces
      if (
        (parseInt(secondClick.slice(-1)) - parseInt(firstClick.slice(-1)) > 1 &&
          piecesLocation[
            firstClick.charAt(0) + (Number(firstClick.slice(-1)) + 1)
          ].includes('white')) ||
        piecesLocation[
          firstClick.charAt(0) + (Number(firstClick.slice(-1)) + 1)
        ].includes('black')
      ) {
        return false;
      }
      // All evaluated
      return true;
      // Black pawn moving restrictions
    } else if (piecesLocation[firstClick].includes('black-pawn')) {
      // Can't move backwards
      if (parseInt(firstClick.slice(-1)) < parseInt(secondClick.slice(-1))) {
        return false;
      }
      // Can't move more than one row
      if (
        firstClick.slice(-1) !== '7' &&
        parseInt(firstClick.slice(-1)) - parseInt(secondClick.slice(-1)) > 1
      ) {
        return false;
      }
      // Can't move more than two rows on first move
      if (
        firstClick.slice(-1) === '7' &&
        parseInt(firstClick.slice(-1)) - parseInt(secondClick.slice(-1)) > 2
      ) {
        return false;
      }
      // Can't move sideways
      if (
        parseInt(secondClick.slice(-1)) - parseInt(firstClick.slice(-1)) ===
        0
      ) {
        return false;
      }
      // Can't take enemy piece unless diagonal
      if (
        (piecesLocation[secondClick].includes('black') ||
          piecesLocation[secondClick].includes('white')) &&
        secondClick.charAt(0) === firstClick.charAt(0)
      ) {
        return false;
      }
      // Can't move diagonal without enemy present
      if (
        secondClick.charAt(0) !== firstClick.charAt(0) &&
        !piecesLocation[secondClick].includes('white')
      ) {
        return false;
      }
      // Can't move diaganol more that one square left or right
      if (Math.abs(firstClick.charCodeAt(0) - secondClick.charCodeAt(0)) > 1) {
        return false;
      }

      // Can't move diagonal on first move if moving two squares
      if (
        Math.abs(firstClick.charCodeAt(0) - secondClick.charCodeAt(0)) > 0 &&
        parseInt(firstClick.slice(-1)) - parseInt(secondClick.slice(-1)) > 1
      ) {
        return false;
      }

      // Can't go through pieces
      if (
        (parseInt(firstClick.slice(-1)) - parseInt(secondClick.slice(-1)) > 1 &&
          piecesLocation[
            firstClick.charAt(0) + (Number(firstClick.slice(-1)) - 1)
          ].includes('white')) ||
        piecesLocation[
          firstClick.charAt(0) + (Number(firstClick.slice(-1)) - 1)
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

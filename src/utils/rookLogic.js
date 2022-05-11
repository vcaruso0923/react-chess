export const rookMoveEval = (firstClick, secondClick, piecesLocation) => {
  if (piecesLocation[firstClick].includes('rook')) {
    // Can't move diagonal
    if (
      parseInt(firstClick.slice(-1)) !== parseInt(secondClick.slice(-1)) &&
      secondClick.charAt(0) !== firstClick.charAt(0)
    ) {
      return false;
    }
    // Can't move over pieces horizontally
    if (parseInt(firstClick.slice(-1)) === parseInt(secondClick.slice(-1))) {
      // moving left
      // prettier-ignore
      if (secondClick.charCodeAt(0) < firstClick.charCodeAt(0)) {
            for (let i = (secondClick.charCodeAt(0) + 1) ; i < firstClick.charCodeAt(0) ; i++) {
                let newCode = String.fromCharCode(i) + firstClick.slice(-1)
                if (piecesLocation[newCode].includes('white') || piecesLocation[newCode].includes('black')) {
                    return false
                }
            }
        }
      // moving right
      // prettier-ignore
      if (firstClick.charCodeAt(0) < secondClick.charCodeAt(0)) {
          for (let i = (firstClick.charCodeAt(0) + 1) ; i < secondClick.charCodeAt(0) ; i++) {
              let newCode = String.fromCharCode(i) + firstClick.slice(-1)
              if (piecesLocation[newCode].includes('white') || piecesLocation[newCode].includes('black')) {
                  return false
              }
          }
        }
    }

    // Can't move over pieces vertically
    if (firstClick.charCodeAt(0) === secondClick.charCodeAt(0)) {
      // moving down
      // prettier-ignore
      if (parseInt(secondClick.slice(-1)) < parseInt(firstClick.slice(-1))) {
              for (let i = (parseInt(secondClick.slice(-1)) + 1) ; i < parseInt(firstClick.slice(-1)) ; i++) {
                  let newCode = firstClick.charAt(0) + i.toString()
                  if (piecesLocation[newCode].includes('white') || piecesLocation[newCode].includes('black')) {
                      return false
                  }
              }
          }
      // moving up
      // prettier-ignore
      if (parseInt(firstClick.slice(-1)) < parseInt(secondClick.slice(-1))) {
              for (let i = (parseInt(firstClick.slice(-1)) + 1) ; i < parseInt(secondClick.slice(-1)) ; i++) {
                  let newCode = firstClick.charAt(0) + i.toString()
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

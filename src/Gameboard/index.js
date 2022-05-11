import React, { useEffect, useState } from 'react';
import { board, whiteSquares, initialPiecesLocation } from '../utils/enums';
import { pieceMoveAttempt } from '../utils/gameLogic';

function Gameboard() {
    const [firstClick, setFirstClick] = useState('');
    const [secondClick, setSecondClick] = useState('');
    const [piecesLocation, setPiecesLocation] = useState(initialPiecesLocation);

    const boardSquareClasses = (item) => {
        let classesString = 'board-square ';
        if (whiteSquares.includes(item)) {
            classesString += 'white-board-square ';
        } else {
            classesString += 'black-board-square ';
        }

        classesString += piecesLocation[item];
        return classesString;
    };

    useEffect(() => {
        console.log(piecesLocation);
    }, [piecesLocation]);

    const boardClickHandler = (e) => {
        e.preventDefault();
        if (pieceMoveAttempt(firstClick, e.target.value, piecesLocation)) {
            setSecondClick(e.target.value);
            let firstClickInitialClass = piecesLocation[firstClick];
            let newLocations = {
                [firstClick]: 'empty-square',
                [e.target.value]: firstClickInitialClass,
            };
            setPiecesLocation({
                ...piecesLocation,
                ...newLocations,
            });
            document
                .getElementById(firstClick)
                .classList.remove('first-piece-selection');
            setFirstClick('');
        } else {
            if (
                firstClick === '' &&
                piecesLocation[e.target.value] !== 'empty-square'
            ) {
                document
                    .getElementById(e.target.value)
                    .classList.add('first-piece-selection');
                setFirstClick(e.target.value);
            } else if (firstClick === e.target.value) {
                document
                    .getElementById(e.target.value)
                    .classList.remove('first-piece-selection');
                setFirstClick('');
            }
        }
    };

    return (
        <div className="board-container">
            {/* <div className="player-1-container">
                <h2>Player 1</h2>
            </div> */}
            <div className="chess-board">
                {board.map((row) =>
                    row.map((item) => (
                        <button
                            onClick={boardClickHandler}
                            className={boardSquareClasses(item)}
                            value={item}
                            id={item}
                        ></button>
                    ))
                )}
            </div>
            {/* <div className="player-2-containter">
                <h2>Player 2</h2>
            </div> */}
        </div>
    );
}

export default Gameboard;

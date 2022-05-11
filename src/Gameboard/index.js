import React, { useEffect, useState } from 'react';
import { board, whiteSquares, initialPiecesLocation } from '../utils/enums';
import { evaluateSecondClick } from '../utils/gameLogic';

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
        if (evaluateSecondClick(firstClick, e.target.value, piecesLocation)) {
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
    );
}

export default Gameboard;

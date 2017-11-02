import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
 * Square  -> React Component
 * render
 * - returns a button with class name square
*/
function Square(props) {
  return (
    <button className='square' onClick={() => {props.onClick();}}>
      {props.value}
    </button>
  );
}


/*
 * Board -> REact componenet
 * renderSquare(i)
 * - returns a square component
 *
 * render
 * - status constant set to 'Next player: X'
 * - status div
 * - div enclosing a status div and 3 board-row divs each calling renderSquare(i)
 */
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRows() {
    const row = [];
    for (let i = 0; i < 3; i += 3) {
      let squares = [];
      for (let j = i; j < i+3; j++) {
        squares.push(
          <Square
            value={this.props.squares[j]}
            onClick={() => this.props.onClick(j)}
          />
        );
      }
      row.push(
        <div className='board-row'>
          {squares}
        </div>
      );
    }

    return (
      <div>
        {row}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderRows()}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moveCoords: [],
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    // change the square's value to X
    // rerenders, so i don't have to change the value of the component if it's
    // linked
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) { return; };
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        moveCoords: calculateCoords(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const moveCoords = step.moveCoords;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          {move === (history.length - 1)
              ? <b>({moveCoords[0]}, {moveCoords[1]})</b>
              : <div>({moveCoords[0]}, {moveCoords[1]})</div>}
        </li>
      );
    });
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i=0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateCoords(square) {
  let x = Math.floor(square/3) + 1;
  let y = square % 3 + 1;
  return [x,y];
  }
// ===========================================================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

/*
 * Game -> REact component
 * render
 * - game div enclosing a game-board div
 * -- renders a board component
 * - game div also encloses game-info
 * -- another div and ol
*/

/*
 * Render to react-dom
 * Render a game componenet and set to root
*/

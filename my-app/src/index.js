import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, toColor) {
    return (
      <Square
        key={i}
        value={
          <span style={toColor ? { color: "red" } : { color: "black" }}>
            {this.props.squares[i]}
          </span>
        }
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  createBoard() {
    let winningMoves = this.props.winningMoves;
    let board = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        let squareNumber = i * 3 + j;
        if (!winningMoves) {
          row.push(this.renderSquare(squareNumber, false));
        } else {
          row.push(
            this.renderSquare(squareNumber, winningMoves.includes(squareNumber))
          );
        }
      }
      board.push(
        <div className="board-row" key={"row" + i}>
          {row}
        </div>
      );
    }
    return board;
  }

  render() {
    return <div>{this.createBoard()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      reversed: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  reverseMoveOrder() {
    this.setState({
      reversed: !this.state.reversed
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let lastMove = -1;
      for (let i = 0; i < 9; i++) {
        if (
          history[move].squares[i] !== history[Math.max(move - 1, 0)].squares[i]
        ) {
          lastMove = i;
        }
      }
      let playerMove = move % 2 === 0 ? "O" : "X";

      const desc = move
        ? "Go to move #" +
          move +
          ": " +
          playerMove +
          " on " +
          "(" +
          Math.floor(lastMove / 3) +
          ", " +
          (lastMove % 3) +
          ")"
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            <span
              style={
                move === this.state.stepNumber
                  ? { fontWeight: "bold" }
                  : { fontWeight: "normal" }
              }
            >
              {desc}
            </span>
          </button>
        </li>
      );
    });

    let status;
    let winningMoves;
    if (winner) {
      status = "Winner: " + winner[0];
      winningMoves = winner[1];
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningMoves={winningMoves}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.reverseMoveOrder()}>
            Reverse move order
          </button>
          <ol>{this.state.reversed ? moves.reverse() : moves}</ol>
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

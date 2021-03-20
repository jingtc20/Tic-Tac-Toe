import React from 'react'
import ReactDom from "react-dom"
import './index.css'

// Square is function component and renders a single button
function Square(props){
    const winStyle = {
        backgroundColor: '#86af49',
        color: '#ffffff',
        fontWeight: 'bold',
      };

    return(
      <button 
          className="square" 
          onClick={() => props.onClick({value: 'X'})} 
          style={props.isWin ? winStyle : null}
      >
        {props.value}
      </button>
    );  
}

// render 9 squares
class Board extends React.Component{
  renderSquare(i){
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        isWin={this.props.winLine && this.props.winLine.includes(i) ? true : false}
      />
    );
  }

  render(){
    var board = []; 
    for (var row=0; row<3; row++){
        var boardRow=[];
        for (var col=0; col<3; col++){
            boardRow.push(this.renderSquare(row * 3 + col))
        }
        board.push(<div className="board-row">{boardRow}</div>)
    }
    
    return(
      <div>
          {board}
      </div>
    );
  }
}

// render a board 
class Game extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
        history: [{
        squares: Array(9).fill(null),
        Loc: [null, null],
        }],
        stepNumber: 0,
        xIsNext: true,          
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (this.state.stepNumber < 9 && squares[i] && !calculateWinner(squares)) {
        return;
    } else if ((squares[i] && this.state.stepNumber === 9) || calculateWinner(squares)){  
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
        });
    } else {
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
        history: history.concat([{
          squares: squares,
          Loc: [Math.floor(i/3) + 1, i%3 + 1],
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        });
    }
  }

  jumpTo(step) {
    this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
    });
  }

  render(){
    const active={fontWeight: 'bold'};
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winInfo = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
        const desc = move ? `Go to move #${move}: [${step.Loc}]`:'Go to game start';
        return (
            <li key={move} style={active}>
              <button onClick={() => this.jumpTo(move)} style={this.state.stepNumber === move ? active: null}>
                  {desc}
              </button>
            </li>
            );
        });
    let status;
    if (this.state.stepNumber === 9 && !winInfo){
        status = 'It ends in a draw!';
    } else if (winInfo) {
        status = 'Winner: ' + winInfo[0];
    } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                winLine={winInfo ? winInfo[1] : null}
                />
            </div>
            <div className="game-info">
                <div>{ status }</div>
                <ol>{ moves }</ol>
            </div>
        </div>
        );
    }
}

// ===========================

ReactDom.render(
	<Game /> ,
	document.getElementById("root")
);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return  [squares[a], lines[i]];
    }
  }
  return null;
}

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  const handlePress = index => {
    if (board[index] || winner) return;

    const newBoard = board.slice();
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const checkWinner = board => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const renderSquare = index => {
    const squareValue = board[index];
    const squareStyle =
      squareValue === 'X'
        ? [styles.square, styles.xSquare]
        : squareValue === 'O'
        ? [styles.square, styles.oSquare]
        : styles.square;

    return (
      <TouchableOpacity style={squareStyle} onPress={() => handlePress(index)}>
        <Text style={styles.squareText}>{squareValue}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Tic Tac Toe</Text>
      <View style={styles.board}>
        {board.map((_, index) => renderSquare(index))}
      </View>
      {winner && <Text style={styles.winnerText}>Winner: {winner}</Text>}
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282A36',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F8F8F2',
    marginBottom: 20,
  },
  board: {
    width: 320,
    height: 320,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 16,
    backgroundColor: '#44475A',
    padding: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    justifyContent: 'center',
  },
  square: {
    width: '30%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: '#6272A4',
  },
  xSquare: {
    backgroundColor: '#FF5555', // Red for X
  },
  oSquare: {
    backgroundColor: '#50FA7B', // Green for O
  },
  squareText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#F8F8F2',
  },
  winnerText: {
    fontSize: 24,
    color: '#50FA7B',
    marginVertical: 20,
  },
  resetButton: {
    marginTop: 65,
    backgroundColor: '#b84cbe',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  resetButtonText: {
    color: '#F8F8F2',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TicTacToe;

# Tic Tac The Toe (Ultimate Tic Tac Toe)

The ultimate fun with the classic game.

## Game concept
Ultimate Tic Tac Toe, also called Meta Tic Tac Toe, takes over the principles of the normal Tic Tac Toe game with the extension that in each Tic Tac Toe field againrum another small Tic Tac Toe playing field is present.

The goal of the small playing fields and the large playing field: to achieve a row of three X or O marks horizontally, vertically or diagonally first in one of the small playing fields and then in the large playing field.

1. once a player has made a move, the square in which he has bet determines which small square the opponent must play next.
2. the opponent must place his next symbol in the small game field that corresponds to the previous player's field. The next field is marked by a coral-colored frame.
3. there are two ways to freely choose a field:
* either you start the game
* or the opponent sends you to a field that has already been won or drawn.
4. the game ends when either the big field has been won or drawn.

Have fun playing Ultimate Tic Tac Toe!

## Operation
- The server runs via pm2 in an infinite loop. If the code is executed via the terminal, then:
'npm install && npm run dev'
must be executed in the server folder.
- in development the page is running over 'localhost:3000'.
- in production the page is only accessible via HTTPS at: https://tictacthetoe.de.


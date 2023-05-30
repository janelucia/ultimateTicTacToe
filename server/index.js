const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
let games = [];

app.use(cors());
app.use(express.json());

app.get('/game/:id', (req, res) => {
  const game = games.find((g) => g.id === parseInt(req.params.id));
  if (!game.held2) {
    res.json('Auf Verbindung warten');
  } else {
    res.json('Held 2 gefunden');
  }
});

app.post('/game', (req, res) => {
  const id = Math.floor(Math.random() * 1e6);
  games = [...games, { held1: req.body.held1, held2: undefined, id }];

  res.setHeader('Location', `${id}`);
  res.status(201).json({ location: `${id}` });
});

app.patch('/game/:id', (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  console.log(games);
  const game = games.find((g) => g.id === parseInt(req.params.id));

  if (!game) {
    res.status(404).send();
  }

  const patchedGame = { ...game, held2: req.body.held2 };
  console.log('Game', patchedGame);

  games.map((g) => {
    if (g.id === patchedGame.id) {
      return patchedGame;
    }
    return g;
  });

  res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

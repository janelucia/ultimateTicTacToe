const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
let games = [];

app.use(cors());
app.use(express.json());

app.get('/game/:id', (req, res) => {
  const game = games.find((g) => g.id === parseInt(req.params.id));
  console.log(games);
  if (!game) {
    res.status(404).send();
  }
  res.json(game);
});

app.post('/game', (req, res) => {
  const id = Math.floor(Math.random() * 1e6);
  games = [...games, { held1: req.body.held1, held2: undefined, id }];

  res.setHeader('Location', `${id}`);
  res.status(201).json({ location: `${id}` });
});

app.patch('/game/:id', (req, res) => {
  const game = games.find((g) => g.id === parseInt(req.params.id));

  if (!game) {
    res.status(404).send();
  }

  const patchedGame = { ...game, held2: req.body.held2 };

  games = games.map((g) => {
    if (g.id === patchedGame.id) {
      return patchedGame;
    }
    return g;
  });

  res.json(patchedGame);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

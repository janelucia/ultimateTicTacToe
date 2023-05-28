const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
let games = [];

app.use(cors());
app.use(express.json());

app.get('/game', (req, res) => {
  const game = { status: 'PLAYER_MISSING' };
  res.json(game);
});

app.post('/game', (req, res) => {
  const id = Math.floor(Math.random() * 1e6);
  games = [...games, { hero1: req.body.hero1, id: req.body.id }];
  console.log(games);
  res.setHeader('Location', `${id}`);
  res.status(201).json({ location: `${id}` });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

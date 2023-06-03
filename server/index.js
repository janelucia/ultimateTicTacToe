const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
let games = [];
let spieler = [];

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

  const spielerUeberpruefen = spieler.find((s) => s.id === req.body.X.id);
  if (spielerUeberpruefen) {
    spieler = [
      ...spieler,
      {
        id: req.body.X.id,
        spieleGespielt: undefined,
        spieleGewonnen: undefined,
      },
    ];
  }

  console.log(spieler);

  games = [
    ...games,
    {
      helden: {
        X: { id: req.body.X.id, name: req.body.X.name, icon: 'X' },
        O: undefined,
      },
      id,
    },
  ];

  res.setHeader('Location', `${id}`);
  res.status(201).json({ location: `${id}` });
});

app.patch('/game/:id', (req, res) => {
  const game = games.find((g) => g.id === parseInt(req.params.id));

  if (!game) {
    return res.status(404).send();
  } else if (game.helden.O) {
    return res.json(game);
  }

  const spielerUeberpruefen = spieler.find((s) => s.id === req.body.O.id);
  if (spielerUeberpruefen) {
    spieler = [
      ...spieler,
      {
        id: req.body.O.id,
        spieleGespielt: undefined,
        spieleGewonnen: undefined,
      },
    ];
  }

  const O = { id: req.body.O.id, name: req.body.O.name, icon: 'O' };

  const momentanerSpieler = Math.random() < 0.5 ? game.helden.X : O;

  const patchedGame = {
    ...game,
    helden: { ...game.helden, O },
    momentanerSpieler,
  };

  games = games.map((g) => {
    if (g.id === patchedGame.id) {
      return patchedGame;
    }
    return g;
  });

  return res.json(patchedGame);
});

app.put('/game/:id', (req, res) => {
  const game = games.find((g) => g.id === parseInt(req.params.id));

  if (!game) {
    return res.status(404).send();
  }

  const momentanerSpieler =
    game.momentanerSpieler.icon === game.helden.X.icon
      ? game.helden.O
      : game.helden.X;

  let momentanerZug = req.body.spielzustand.momentanerZug;

  let spielfeld = req.body.spielzustand.spielfeld;

  let gewinner = req.body.spielzustand.gewinner;

  console.log(gewinner);

  const patchedGame = {
    ...game,
    momentanerSpieler,
    momentanerZug,
    spielfeld,
    gewinner,
  };

  games = games.map((g) => {
    if (g.id === patchedGame.id) {
      return patchedGame;
    }
    return g;
  });

  return res.json(patchedGame);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

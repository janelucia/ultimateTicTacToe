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
  if (!game) {
    res.status(404).send();
  }
  res.json(game);
});

app.post('/game', (req, res) => {
  const id = Math.floor(Math.random() * 1e6);

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

  const patchedGame = {
    ...game,
    momentanerSpieler,
    momentanerZug,
    spielfeld,
  };

  games = games.map((g) => {
    if (g.id === patchedGame.id) {
      return patchedGame;
    }
    return g;
  });

  return res.json(patchedGame);
});

app.post('/spieler', (req, res) => {
  const held = spieler.find((d) => d.heldId === req.body.spieler.id);

  if (held) {
    return res.send();
  }

  spieler = [
    ...spieler,
    {
      heldId: req.body.spieler.id,
      name: req.body.spieler.name,
      spiele: [],
    },
  ];

  console.log(spieler);

  res.status(201).send();
});

app.put('/spieler', (req, res) => {
  const held = spieler.find((d) => d.heldId === req.body.spieler.id);

  console.log('Held', held);

  if (!held) {
    return res.status(404).send();
  }

  let updateSpieler;
  const name = req.body.spieler.name;

  const heldenSpiele = req.body.spiele;
  const spielId = req.body.spiele.spielId;
  const gewinner = req.body.spiele.gewinnerId;

  const testSpielId = held.spiele.find((d) => d.spielId === spielId);

  console.log('spiele', heldenSpiele);
  console.log('spieleID', spielId);
  console.log('Helden Spiel ID', held.spiele.spielId);
  console.log(testSpielId);

  if (!spielId) {
    updateSpieler = {
      ...held,
      name,
    };
  } else if (!testSpielId) {
    updateSpieler = {
      ...held,
      name,
      spiele: [...held.spiele, { spielId }],
    };
  } else if (gewinner) {
    const spiel = heldenSpiele.find((d) => d.spielId === spielId);
    gewinner = gewinner === held.id;
    console.log('Gewinner', gewinner);
    updateSpieler = {
      ...held,
      spiele: [
        ...held.spiele.filter((d) => d.spielId !== spiel.spielId),
        { ...spiel, gewinner: [...gewinner, gewinner] },
      ],
    };
  } else if (testSpielId) {
    return res.send();
  }

  spieler = spieler.map((s) => {
    if (s.heldId === updateSpieler.heldId) {
      return updateSpieler;
    }
    return s;
  });

  console.log(spieler);
  console.log(held);

  return res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

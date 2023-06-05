const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
let lobbies = [];
let spieler = [];

app.use(cors());
app.use(express.json());

app.get('/lobby/:id', (req, res) => {
  const lobby = lobbies.find((l) => l.id === parseInt(req.params.id));
  if (!lobby) {
    res.status(404).send();
  }
  res.json(lobby);
});

app.post('/lobby', (req, res) => {
  let id = Math.floor(Math.random() * 1e6);
  let spielId = id++;

  lobbies = [
    ...lobbies,
    {
      helden: {
        X: { id: req.body.X.id, name: req.body.X.name, icon: 'X' },
        O: undefined,
      },
      id,
      spiele: [{ spielId }],
    },
  ];

  res.setHeader('Location', `${id}`);
  res.status(201).json({ location: `${id}` });
});

app.patch('/lobby/:id', (req, res) => {
  const lobby = lobbies.find((l) => l.id === parseInt(req.params.id));

  if (!lobby) {
    return res.status(404).send();
  } else if (lobby.helden.O) {
    return res.json(lobby);
  }

  const O = { id: req.body.O.id, name: req.body.O.name, icon: 'O' };

  const momentanerSpieler = Math.random() < 0.5 ? lobby.helden.X : O;

  const patchedGame = {
    ...lobby,
    helden: { ...lobby.helden, O },
    momentanerSpieler,
  };

  lobbies = lobbies.map((l) => {
    if (l.id === patchedGame.id) {
      return patchedGame;
    }
    return l;
  });

  return res.json(patchedGame);
});

app.put('/lobby/:id', (req, res) => {
  const lobby = lobbies.find((l) => l.id === parseInt(req.params.id));

  if (!lobby) {
    return res.status(404).send();
  }

  const momentanerSpieler =
    lobby.momentanerSpieler.icon === lobby.helden.X.icon
      ? lobby.helden.O
      : lobby.helden.X;

  let momentanerZug = req.body.spielzustand.momentanerZug;

  let spielfeld = req.body.spielzustand.spielfeld;

  const patchedGame = {
    ...lobby,
    momentanerSpieler,
    momentanerZug,
    spielfeld,
  };

  lobbies = lobbies.map((l) => {
    if (l.id === patchedGame.id) {
      return patchedGame;
    }
    return l;
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

  console.log('Held', spieler);

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

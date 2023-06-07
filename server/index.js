const express = require('express');
const cors = require('cors');
const fs = require('fs'); //write to filesystem,um lobbies und spieler nachhaltig zu speichern
const lobbiesFile = 'lobbies.json'; //um den Zustand zu speichern
const spielerFile = 'spieler.json';
const app = express();
const port = 3000;
let lobbies = [];
let spieler = [];

app.use(cors()); // findet er nicht so schön - lieber beides unter einem Port laufen lassen
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
  let spielId = Math.floor(Math.random() * 1e6);
  do {
    spielId = Math.floor(Math.random() * 1e6);
  } while (id === spielId);

  lobbies = [
    ...lobbies,
    {
      helden: {
        X: { id: req.body.X.id, name: req.body.X.name, icon: 'X' },
        O: undefined,
      },
      id,
      momentanesSpiel: spielId,
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

  let patchedGame = {
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

app.post('/lobby/:id', (req, res) => {
  const lobby = lobbies.find((l) => l.id === parseInt(req.params.id));

  if (!lobby) {
    return res.status(404).send();
  }

  let spielId;

  do {
    spielId = Math.floor(Math.random() * 1e6);
  } while (lobby.id === spielId);

  const momentanesSpiel = spielId;

  const momentanerSpieler =
    Math.random() < 0.5 ? lobby.helden.X : lobby.helden.O;

  const momentanerZug = req.body.zustand.momentanerZug;

  const spielfeld = req.body.zustand.spielfeld;

  let patchedGame = {
    ...lobby,
    momentanesSpiel,
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

  res.status(201).send();
});

app.patch('/spieler/:id', (req, res) => {
  const name = req.body.spieler;
  const held = spieler.find((d) => d.heldId === req.params.id);

  if (!held) {
    return res.status(404).send();
  }

  // wenn noch kein Spiel gespielt wird, dann wird hier nur der Namen vom Helden geändert, falls der User einen neuen Namen angibt.

  let updateSpieler = {
    ...held,
    name,
  };

  spieler = spieler.map((s) => {
    if (s.heldId === updateSpieler.heldId) {
      return updateSpieler;
    }
    return s;
  });

  console.log('Spieler: ', spieler);

  res.send();
});

app.put('/spieler', (req, res) => {
  const held = spieler.find((d) => d.heldId === req.body.spieler.id);

  if (!held) {
    return res.status(404).send();
  }

  console.log('Zustand', req.body.zustand);

  let updateSpieler;

  const spielId = req.body.zustand.spielId;
  const spielmodus = req.body.zustand.spielmodus;
  const gewinner = req.body.zustand.gewinnerId;

  const spielIdSuchen = held.spiele.find((d) => d.spielId === spielId);

  if (spielIdSuchen) {
    return res.status(404).send('Spiel und Gewinner existieren schon');
  }

  // falls noch kein Spiel mit der Spielid existiert, dann wird diese gesetzt. Da die Funktion erst am Ende des jeweiligen Spiel aufgerufen wird, wird das Spiel und der Gewinner gleichzeitig gesetzt
  let istGewinner = gewinner === held.heldId;

  updateSpieler = {
    ...held,
    spiele: [...held.spiele, { spielId, gewinner: istGewinner, spielmodus }],
  };

  console.log('Update Spieler', updateSpieler);

  spieler = spieler.map((s) => {
    if (s.heldId === updateSpieler.heldId) {
      return updateSpieler;
    }
    return s;
  });

  return res.send();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

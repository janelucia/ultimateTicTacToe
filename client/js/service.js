/**
 * erstellt ein neues Spiel
 * @returns Pfad zur erstellten Spiel-Ressource
 */

function neuesMehrspielerSpielErstellen(held) {
  return (
    fetch(GAME_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        X: held,
      }),
    })
      // kann nicht location header auslesen wegen CORS, deshalb wird auf body zurückgegriffen
      .then((data) => data.json())
  );
}

async function pollNeuesMehrspielerSpiel(id) {
  const statusHeld2 = await new Promise((aufloesen) => {
    let held2Finden = setInterval(async () => {
      const antwort = await fetch(`${GAME_ENDPOINT}/${id}`, {
        method: 'GET',
      });
      const json = await antwort.json();
      if (json.helden.O) {
        clearInterval(held2Finden);
        aufloesen(json);
      }
    }, PULL_TIMEOUT);
  });
  return statusHeld2;
}

async function neuesMehrspielerSpiel(held) {
  const spielErstellen = await neuesMehrspielerSpielErstellen(held);
  linkRendern(spielErstellen);
  const status = await pollNeuesMehrspielerSpiel(spielErstellen.location);
  if (status) {
    window.location = `/client/game.html?mode=mehrspieler&spielBeitreten=${status.id}`;
    localStorage.setItem('status', JSON.stringify(status));
  }
}

function heldZumSpielHinzufuegen(heldName) {
  const spielId = spielIdHolen();

  return fetch(`${GAME_ENDPOINT}/${spielId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      O: heldName,
    }),
  });
}

async function spielstandHolen() {
  const spielId = spielIdHolen();
  const antwort = await fetch(`${GAME_ENDPOINT}/${spielId}`, {
    method: 'GET',
  });
  return await antwort.json();
}

async function aufSpielstandWarten(aktuellerSpieler) {
  const spielId = spielIdHolen();
  const spielstand = await new Promise((aufloesen) => {
    let spielstandFinden = setInterval(async () => {
      const antwort = await fetch(`${GAME_ENDPOINT}/${spielId}`, {
        method: 'GET',
      });
      const json = await antwort.json();
      if (json.momentanerSpieler.id === aktuellerSpieler) {
        clearInterval(spielstandFinden);
        aufloesen(json);
      }
    }, PULL_TIMEOUT);
  });
  return spielstand;
}

async function spielstandUpdate(zustand) {
  const id = spielIdHolen();
  return fetch(`${GAME_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spielzustand: zustand,
    }),
  });
}

async function spielerZurListeHinzufuegen() {
  const spielerInfosHolen = sessionStorageInformationen();
  return fetch(`${SPIELER_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spieler: spielerInfosHolen,
    }),
  });
}

async function spielerListeUpdaten(gewinner) {
  const spielerInfosHolen = sessionStorageInformationen();
  const spielId = spielIdHolen();
  return fetch(`${SPIELER_ENDPOINT}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spieler: spielerInfosHolen,
      spiele: { spielId, gewinner },
    }),
  });
}

/* TODO:
 * Spieler und ihre Spiele (unterschieden in gewonnen und nicht) anzeigen
 */

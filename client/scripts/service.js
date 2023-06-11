/**
 * erstellt ein neues Spiel
 * @returns Pfad zur erstellten Spiel-Ressource
 */

function neuesMehrspielerSpielErstellen(held) {
  return (
    fetch(LOBBY_ENDPOINT, {
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
      const antwort = await fetch(`${LOBBY_ENDPOINT}/${id}`, {
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
    window.location = `/client/spiel.html?mode=mehrspieler&spielBeitreten=${status.id}`;
  }
}

function heldZumSpielHinzufuegen(heldName) {
  const lobbyId = lobbyIdHolen();

  return fetch(`${LOBBY_ENDPOINT}/${lobbyId}`, {
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
  const lobbyId = lobbyIdHolen();
  const antwort = await fetch(`${LOBBY_ENDPOINT}/${lobbyId}`, {
    method: 'GET',
  });
  return await antwort.json();
}

async function aufSpielstandWarten(aktuellerSpieler) {
  const spielId = lobbyIdHolen();
  const spielstand = await new Promise((aufloesen) => {
    let spielstandFinden = setInterval(async () => {
      const antwort = await fetch(`${LOBBY_ENDPOINT}/${spielId}`, {
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
  const id = lobbyIdHolen();
  return fetch(`${LOBBY_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spielzustand: zustand,
    }),
  });
}

async function weiteresMehrspielerSpielErstellen(zustand) {
  const id = lobbyIdHolen();
  return fetch(`${LOBBY_ENDPOINT}/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      zustand,
    }),
  });
}

async function alleSpielerHolen() {
  return fetch(`${SPIELER_ENDPOINT}`, {
    method: 'GET',
  });
}

async function spielerHolen() {
  const spielerInfosHolen = localStorageInformationen();
  const spielerId = spielerInfosHolen.id;
  return fetch(`${SPIELER_ENDPOINT}/${spielerId}`, {
    method: 'GET',
  });
}

async function spielerAnlegen() {
  const spielerInfosHolen = localStorageInformationen();
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

async function spielerNamenAendern() {
  const spielerInfosHolen = localStorageInformationen();
  const spielerId = spielerInfosHolen.id;
  return fetch(`${SPIELER_ENDPOINT}/${spielerId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spieler: spielerInfosHolen.name,
    }),
  });
}

async function spielerListeUpdaten(zustand) {
  const spielerInfosHolen = localStorageInformationen();
  return fetch(`${SPIELER_ENDPOINT}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spieler: spielerInfosHolen,
      zustand,
    }),
  });
}

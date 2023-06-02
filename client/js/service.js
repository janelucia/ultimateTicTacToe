const SERVER_URL = 'http://localhost:3000';
const GAME_ENDPOINT = `${SERVER_URL}/game`;

/**
 * erstellt ein neues Spiel
 * @returns Pfad zur erstellten Spiel-Ressource
 */

function neuesMehrspielerSpielErstellen(heldName) {
  return (
    fetch(GAME_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        X: heldName,
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
    }, 3000);
  });
  return statusHeld2;
}

async function neuesMehrspielerSpiel(heldName) {
  const spielErstellen = await neuesMehrspielerSpielErstellen(heldName);
  linkRendern(spielErstellen);
  const status = await pollNeuesMehrspielerSpiel(spielErstellen.location);
  if (status) {
    window.location = `/client/game.html?mode=mehrspieler&joinGame=${status.id}&istSpielErsteller=true`;
    localStorage.setItem('status', JSON.stringify(status));
  }
}

function idHolen() {
  let params = new URL(document.location).searchParams;
  return params.get('joinGame');
}

function istSpielErsteller() {
  let params = new URL(document.location).searchParams;
  return params.get('istSpielErsteller') === 'true';
}

function heldZumSpielHinzufuegen(heldName) {
  const id = idHolen();

  return fetch(`${GAME_ENDPOINT}/${id}`, {
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
  const aktuellerSpieler = istSpielErsteller();
  const id = idHolen();
  const spielstand = await new Promise((aufloesen) => {
    let spielstandFinden = setInterval(async () => {
      const antwort = await fetch(`${GAME_ENDPOINT}/${id}`, {
        method: 'GET',
      });
      const json = await antwort.json();
      if (json.momentanerSpieler.icon === aktuellerSpieler) {
        clearInterval(spielstandFinden);
        aufloesen(json);
      }
    }, 5000);
  });
  return spielstand;
}

async function spielstandUpdate(zustand) {
  const id = idHolen();
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

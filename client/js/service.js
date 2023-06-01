const url = 'http://localhost:3000/game';

/**
 * erstellt ein neues Spiel
 * @returns Pfad zur erstellten Spiel-Ressource
 */

function neuesMehrspielerSpielErstellen() {
  return (
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        X: 'Held 1',
      }),
    })
      // kann nicht location header auslesen wegen CORS, deshalb wird auf body zurückgegriffen
      .then((data) => data.json())
  );
}

async function pollNeuesMehrspielerSpiel(id) {
  const statusHeld2 = await new Promise((aufloesen) => {
    let held2Finden = setInterval(async () => {
      const antwort = await fetch(`${url}/${id}`, {
        method: 'GET',
      });
      const json = await antwort.json();
      if (json.helden.O) {
        clearInterval(held2Finden);
        aufloesen(json);
      }
    }, 5000);
  });
  return statusHeld2;
}

async function neuesMehrspielerSpiel() {
  const spielErstellen = await neuesMehrspielerSpielErstellen();
  linkRendern(spielErstellen);
  const status = await pollNeuesMehrspielerSpiel(spielErstellen.location);
  console.log(status);
  if (status) {
    window.location = `/client/game.html?mode=mehrspieler&joinGame=${status.id}&held=X`;
  }
}

function idHolen() {
  let params = new URL(document.location).searchParams;
  return params.get('joinGame');
}

function aktuellerSpielerHolen() {
  let params = new URL(document.location).searchParams;
  return params.get('held');
}

function heldZumSpielHinzufuegen() {
  const id = idHolen();

  return fetch(`${url}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      O: 'Held 2',
    }),
  });
}

async function spielstandHolen() {
  const aktuellerSpieler = aktuellerSpielerHolen();
  const id = idHolen();
  const spielstand = await new Promise((aufloesen) => {
    let spielstandFinden = setInterval(async () => {
      const antwort = await fetch(`${url}/${id}`, {
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
  return fetch(`${url}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      zustand,
    }),
  });
}

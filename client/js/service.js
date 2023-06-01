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
        held1: 'Held 1',
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
      if (json.held2) {
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
    // TODO: welcher Held?
    window.location = `/client/game.html?mode=mehrspieler&joinGame=${status.id}&held=held1`;
  }
}

function idHolen() {
  let params = new URL(document.location).searchParams;
  let id = params.get('joinGame');
  return id;
}

function heldZumSpielHinzufuegen() {
  const id = idHolen();

  return fetch(`${url}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      held2: 'Held 2',
    }),
  });
}

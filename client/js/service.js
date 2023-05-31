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

function pollNeuesMehrspielerSpiel(id) {
  let statusHeld2;
  let held2Finden = setInterval(() => {
    statusHeld2 = fetch(`${url}/${id}`, {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((d) => console.log(d)); // Wieso funktioniert dieses Console.log nicht?
  }, 5000);
  if (held2Finden.held2) {
    clearInterval(held2Finden);
  }
  return statusHeld2;
}

async function neuesMehrspielerSpiel() {
  const spielErstellen = await neuesMehrspielerSpielErstellen();
  linkRendern(spielErstellen);
  pollNeuesMehrspielerSpiel(spielErstellen.location);
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

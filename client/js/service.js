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
  do {
    statusHeld2 = fetch(`${url}/${id}`, {
      method: 'GET',
    })
      .then((d) => d.json())
      .then((d) => console.log(d));
  } while (statusHeld2 === 'Auf Verbindung warten');
  return statusHeld2;
}

async function neuesMehrspielerSpiel() {
  const spielErstellen = await neuesMehrspielerSpiel();
  linkRendern(spielErstellen);
  pollNeuesMehrspielerSpiel(spielErstellen.id);
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

/**
 * erstellt ein neues Spiel
 * @returns Pfad zur erstellten Spiel-Ressource
 */
function neuesMehrspielerSpiel() {
  return (
    fetch('http://localhost:3000/game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hero1: 'Hero 1',
      }),
    })
      // kann nicht location header auslesen wegen CORS, deshalb wird auf body zurückgegriffen
      .then((data) => data.json())
  );
}

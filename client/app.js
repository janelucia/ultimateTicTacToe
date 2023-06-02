browserId();

// richtige Seite laden
document.addEventListener('DOMContentLoaded', async () => {
  const currentPath = window.location.pathname;
  if (currentPath.endsWith('/')) {
    heldenNamenInputRendern();
  } else if (currentPath.endsWith('/gegnersuche.html')) {
    // TODO: Namen vom Spieler holen
    await neuesMehrspielerSpiel('Held 1');
  } else if (currentPath.endsWith('/game.html')) {
    spielStarten();
  }
});

// Funktionen

function browserId() {
  if (sessionStorage.getItem('id')) {
    return;
  }
  const id = Math.round(Math.random() * 1e6);
  sessionStorage.setItem('id', JSON.stringify(id));
  console.log(id);
}

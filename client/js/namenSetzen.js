function heldenNamenSetzen() {
  const namenInput = document.getElementById('spielername').value;
  if (namenInput === '') {
    sessionStorage.removeItem('name');
    heldenNamenInputRendern();
    return;
  }
  sessionStorage.setItem('name', JSON.stringify(namenInput));
  heldenNamenInputRendern();
}

function zufaelligeNamenWuerfeln() {
  return spielerNamen.spieler.sort(() => Math.random() - 0.5);
}

function heldenNamenInputRendern() {
  const ueberschrift = document.querySelector('.right-side h2');

  const sessionStorageName = sessionStorage.getItem('name');

  if (!sessionStorageName) {
    ueberschrift.innerText = 'Herzlich Willkommen, Spieler!';
  } else {
    ueberschrift.innerText = `Herzlich Willkommen, ${JSON.parse(
      sessionStorageName
    )}!`;
  }
}

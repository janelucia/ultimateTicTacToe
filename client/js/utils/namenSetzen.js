async function inputFeldHeldenNamen() {
  const namenInput = document.getElementById('spielername').value;
  if (namenInput === '') {
    sessionStorage.removeItem('name');
    heldenNamenInputRendern();
    return;
  }
  console.debug(namenInput);
  sessionStorageNameSetzen(namenInput);

  heldenNamenInputRendern();
}

async function zufaelligeNamenWuerfelnAusfuehren() {
  let zufaelligeNamen = zufaelligeNamenWuerfelnArray();
  let namenInput = zufaelligeNamen[0];

  let input = document.getElementById('spielername');
  input.value = namenInput;

  sessionStorageNameSetzen(namenInput);
  await spielerNamenAendern();

  heldenNamenInputRendern();
}

function sessionStorageNameSetzen(namen) {
  sessionStorage.setItem('name', namen);
}

function zufaelligeNamenWuerfelnArray() {
  return spielerNamen.spieler.sort(() => Math.random() - 0.5);
}

function heldenNamenInputRendern() {
  const ueberschrift = document.querySelector('.rechte-seite h2');

  const sessionStorageName = sessionStorage.getItem('name');

  ueberschrift.innerText = `Herzlich Willkommen, ${
    !sessionStorageName ? 'Spieler!' : sessionStorageName
  }`;

  let input = document.getElementById('spielername');
  input.value = sessionStorageName;
}

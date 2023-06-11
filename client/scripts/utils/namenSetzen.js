async function inputFeldHeldenNamen() {
  const namenInput = document.getElementById('spielername').value;
  if (namenInput === '') {
    localStorage.removeItem('name');
    heldenNamenInputRendern();
    return;
  }
  console.debug(namenInput);
  localStorageNameSetzen(namenInput);

  heldenNamenInputRendern();
}

async function zufaelligeNamenWuerfelnAusfuehren() {
  let zufaelligeNamen = zufaelligeNamenWuerfelnArray();
  let namenInput = zufaelligeNamen[0];

  let input = document.getElementById('spielername');
  input.value = namenInput;

  localStorageNameSetzen(namenInput);
  await spielerNamenAendern();

  heldenNamenInputRendern();
}

function localStorageNameSetzen(namen) {
  localStorage.setItem('name', namen);
}

function zufaelligeNamenWuerfelnArray() {
  return spielerNamen.spieler.sort(() => Math.random() - 0.5);
}

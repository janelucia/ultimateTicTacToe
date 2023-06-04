browserIdSetzen();

// richtige Seite laden
document.addEventListener('DOMContentLoaded', async () => {
  const currentPath = window.location.pathname;
  if (currentPath.endsWith('/lobby.html')) {
    await spielerZurListeHinzufuegen();
    heldenNamenInputRendern();
    if (spielIdHolen()) {
      gegnerIndexSeiteRendern();
    }
  } else if (currentPath.endsWith('/gegnersuche.html')) {
    leerenNamenVerhindern();
    await neuesMehrspielerSpiel(sessionStorageInformationen());
  } else if (currentPath.endsWith('/game.html')) {
    leerenNamenVerhindern();
    spielStarten();
    await spielerListeUpdaten();
  }
});

function browserIdSetzen() {
  if (sessionStorage.getItem('id')) {
    return;
  }
  const id = Math.round(Math.random() * 1e6);
  sessionStorage.setItem('id', JSON.stringify(id));
  console.log(id);
}

async function leerenNamenVerhindern() {
  const namenHolen = sessionStorageInformationen();
  let namen = namenHolen.name;
  console.log(namen);
  if (namen) {
    return;
  }
  let zufaelligeNamen = zufaelligeNamenWuerfelnArray();
  namen = zufaelligeNamen[0];

  sessionStorageNameSetzen(namen);
  await spielerListeUpdaten();

  return namenHolen === namen;
}

function sessionStorageInformationen() {
  const id = sessionStorage.getItem('id');
  const name = sessionStorage.getItem('name');
  return { id, name };
}

function spielIdHolen() {
  const spielIdHolen = new URL(document.location).searchParams;
  return spielIdHolen.get('spielBeitreten');
}

// Spielmodus bestimmen (Singleplayer, Hotseat oder Robo)
const spielmodus = () => {
  let params = new URL(document.location).searchParams;
  return params.get('mode');
};

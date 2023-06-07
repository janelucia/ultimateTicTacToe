browserIdSetzen();

// richtige Seite laden
document.addEventListener('DOMContentLoaded', async () => {
  const currentPath = window.location.pathname;
  if (currentPath.endsWith('/lobby.html')) {
    await spielerAnlegen();
    heldenNamenInputRendern();
    if (lobbyIdHolen()) {
      gegnerIndexSeiteRendern();
    }
  } else if (currentPath.endsWith('/gegnersuche.html')) {
    leerenNamenVerhindern();
    await neuesMehrspielerSpiel(sessionStorageInformationen());
  } else if (currentPath.endsWith('/game.html')) {
    if (spielmodus() !== 'hotseat') {
      leerenNamenVerhindern();
    }
    spielStarten();
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
  if (namen) {
    return;
  }
  let zufaelligeNamen = zufaelligeNamenWuerfelnArray();
  namen = zufaelligeNamen[0];

  sessionStorageNameSetzen(namen);
  await spielerNamenAendern();

  return namenHolen === namen;
}

function sessionStorageInformationen() {
  const id = sessionStorage.getItem('id');
  const name = sessionStorage.getItem('name');
  return { id, name };
}

function lobbyIdHolen() {
  const lobbyIdHolen = new URL(document.location).searchParams;
  return lobbyIdHolen.get('spielBeitreten');
}

/**
 * Spielmodus bestimmen (Singleplayer, Hotseat oder Robo)
 * @returns {('mehrspieler' | 'singleplayer' | 'hotseat')}
 */
const spielmodus = () => {
  let params = new URL(document.location).searchParams;
  return params.get('mode');
};

// Hamburger Menü

function clickHamburger() {
  const hamburger = document.querySelector('.hamburger');
  hamburger.classList.toggle('cross');
  const menu = document.querySelector('.menu');
  menu.classList.toggle('menuOpen');
}

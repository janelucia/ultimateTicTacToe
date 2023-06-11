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
    await spielerAnlegen();
    await leerenNamenVerhindern();
    await neuesMehrspielerSpiel(localStorageInformationen());
  } else if (currentPath.endsWith('/spiel.html')) {
    await spielerAnlegen();
    await leerenNamenVerhindern();
    spielStarten();
  } else if (currentPath.endsWith('/profil.html')) {
    await leerenNamenVerhindern();
    renderSpieleUebersicht();
  } else if (currentPath.endsWith('/heldentafel.html')) {
    await leerenNamenVerhindern();
    spielerListeHolen();
  }
});

function browserIdSetzen() {
  if (localStorage.getItem('id')) {
    return;
  }
  const id = Math.round(Math.random() * 1e6);
  localStorage.setItem('id', JSON.stringify(id));
}

async function leerenNamenVerhindern() {
  const namenHolen = localStorageInformationen();
  let namen = namenHolen.name;
  if (namen) {
    return;
  }
  let zufaelligeNamen = zufaelligeNamenWuerfelnArray();
  namen = zufaelligeNamen[0];

  localStorageNameSetzen(namen);
  await spielerNamenAendern();

  return namenHolen === namen;
}

function localStorageInformationen() {
  const id = localStorage.getItem('id');
  const name = localStorage.getItem('name');
  return { id, name };
}

function lobbyIdHolen() {
  const lobbyIdHolen = new URL(document.location).searchParams;
  return lobbyIdHolen.get('spielBeitreten');
}

/**
 * Spielmodus bestimmen (Einzelspieler, Hotseat oder Robo)
 * @returns {('mehrspieler' | 'einzelspieler' | 'hotseat')}
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

// den Link für den Mehrspielermodus kopieren

function textKopieren() {
  const linkElement = document.getElementById('mehrspieler-link');
  const linkText = linkElement.textContent;

  navigator.clipboard
    .writeText(linkText)
    .then(() => {
      alert('Link copied to clipboard!');
    })
    .catch((error) => {
      console.error('Failed to copy link:', error);
    });
}

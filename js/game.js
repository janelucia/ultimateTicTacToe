const SPIELFELD_KLASSE = 'spielfeld';
const SPIELANZEIGE_KLASSE = 'spielanzeige';
const FELD_KLASSE = 'feld';
const SPIELER_KLASSE = 'spieler';
const GEGNER_KLASSE = 'gegner';
const OVERLAY_KLASSE = 'overlay';
const OVERLAY_TEXT_KLASSE = 'overlay-text';
const OVERLAY_BUTTON_KLASSE = 'overlay-button';
const SICHTBAR_KLASSE = 'sichtbar';

const spielfeld = document.querySelector('.' + SPIELFELD_KLASSE);
const spielanzeige = document.querySelector('.' + SPIELANZEIGE_KLASSE);
const overlay = document.querySelector('.' + OVERLAY_KLASSE);
const overlayText = document.querySelector('.' + OVERLAY_TEXT_KLASSE);
const overlayButton = document.querySelector('.' + OVERLAY_BUTTON_KLASSE);

const heroes = {
  spieler: { name: 'I am Hero 1', icon: '' },
  gegner: { name: 'I am Hero 2', icon: '' },
};

const initialBoardArr = {
  board: Array(3).fill(Array(3).fill(Array(3).fill(Array(3).fill('')))),
};

const SIEG_KOMBINATION = [
  [felder[0], felder[1], felder[2]],
  [felder[3], felder[4], felder[5]],
  [felder[6], felder[7], felder[8]],
  [felder[0], felder[3], felder[6]],
  [felder[1], felder[4], felder[7]],
  [felder[2], felder[5], felder[8]],
  [felder[0], felder[4], felder[8]],
  [felder[2], felder[4], felder[6]],
];

let currentPlayer;

overlayButton.addEventListener('click', spielStarten);

spielStarten();

const togglePlayer = () => {
  if (aktuelleKlasse === spieler) {
    // spieler beendet seinen Zug -> zum gegner wechseln
    aktuelleKlasse = gegner;
  } else if (aktuelleKlasse === gegner) {
    // gegner beendet seinen Zug -> zum spieler wechseln
    aktuelleKlasse = spieler;
  }
};

function klickVerarbeiten() {
  // Den Klick verhindern, wenn der gegner gerade am Zug ist
  if (aktuelleKlasse === gegner) {
    return;
  }

  // Ermittelt, welches Feld geklickt wurde
  const feld = ereignis.target;

  // Spielstein auf dieses Feld setzen
  if (spielsteinSetzen(feld) === true) {
    // Beende den Zug, wenn der Spielstein erfolgreich gesetzt wurde
    zugBeenden();
  }
}

function spielsteinSetzen(feld) {
  // // Prüfen, ob das Feld schon besetzt ist
  // if (feld.classList.contains(spieler) || feld.classList.contains(gegner)) {
  //   // Verhindern, dass ein Spielstein gesetzt wird
  //   return false;
  // }
  // // Dem Feld die Klasse des Spielers anhängen, der gerade an der Reihe ist
  // feld.classList.add(aktuelleKlasse);
  // // Das Feld deaktivieren, um weitere Klicks zu verhindern
  // feld.disabled = true;
  // // Signalisieren, dass der Spielstein erfolgreich gesetzt wurde
  // return true;
}

function spielStarten(heroes) {
  const spieler = heroes.spieler;
  const gegner = heroes.gegner;

  // Das Overlay wieder verstecken, falls es bereits sichtbar ist
  overlay.classList.remove(SICHTBAR_KLASSE);

  // Die Klasse des letzten Siegers vom Overlay-Text entfernen
  overlayText.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);

  // der Zufall entscheidet, wer beginnt
  currentPlayer = Math.random() < 0.5 ? spieler : gegner;

  // zufälliges assignment des Icons

  const randomPlayer = Math.round(Math.random());
  if (randomPlayer === 0) {
    heroes.spieler.icon = '✗';
    heroes.gegner.icon = '⚪';
  } else {
    heroes.spieler.icon = '⚪';
    heroes.gegner.icon = '✗';
  }

  gameOverviewRender(heroes, currentPlayer);
  boardRender(currentPlayer);
}

function zugBeenden() {
  // Prüfen, ob der spieler, der gerade an der Reihe ist, gewonnen hat
  if (siegPruefen() === true) {
    // Ist das der Fall, wird das Spiel beendet
    spielBeenden(false);

    // zugBeenden-Funktion unterbrechen, um nicht zum anderen spieler zu wechseln
    return;
  }

  // Prüfen, ob ein Unentschieden entstanden ist
  if (unentschiedenPruefen() === true) {
    // Ist das der Fall, wird das Spiel beendet
    spielBeenden(true);
  }

  spielanzeigeAktualisieren();

  // Ist der gegner an der Reihe, muss ein Computerzug ausgeführt werden
  if (aktuelleKlasse === gegner) {
    setTimeout(computerZugAusfuehren, 750);
  }
}

function spielanzeigeAktualisieren() {
  // Die Klasse des aktuellen Spielers von der Spielanzeige entwerfen
  spielanzeige.classList.remove(spieler, gegner);

  // Text der Spielanzeige anpassen: je nachdem, wer gerade am Zug ist
  if (aktuelleKlasse === spieler) {
    spielanzeige.innerText = 'Du bist am Zug.';
  } else {
    spielanzeige.innerText = 'Dein gegner ist am Zug.';
  }

  // Die Klasse des Spielers, der gerade am Zug ist an die Spielanzeige hängen
  spielanzeige.classList.add(aktuelleKlasse);
}

function siegPruefen() {
  // Gehe alle Siegkombinationen durch
  for (const kombination of SIEG_KOMBINATION) {
    // Prüfe, ob alle 3 Felder der gleichen Klasse angehören
    const gewonnen = kombination.every(function (feld) {
      return feld.classList.contains(aktuelleKlasse);
    });

    if (gewonnen === true) {
      // Beende die Funktion & signalisiere, dass der spieler gewonnen hat
      return true;
    }
  }

  // Signalisieren, dass das Spiel (noch) NICHT gewonnen ist
  return false;
}

function spielBeenden(unentschieden) {
  // Text für Overlay
  if (unentschieden === true) {
    overlayText.innerText = 'Unentschieden!';
  } else if (aktuelleKlasse === spieler) {
    overlayText.innerText = 'Du hast gewonnen!';
    overlayText.classList.add(spieler);
  } else {
    overlayText.innerText = 'Dein gegner hat gewonnen!';
    overlayText.classList.add(gegner);
  }

  // Das Overlay sichtbar machen
  overlay.classList.add(SICHTBAR_KLASSE);
}

function unentschiedenPruefen() {
  // Gehe alle Felder durch
  for (const feld of felder) {
    // Prüfe, ob das Feld noch unbesetzt ist
    if (!feld.classList.contains(spieler) && !feld.classList.contains(gegner)) {
      // Gibt es ein unbesetztes Feld, kann es kein Unentschieden sein
      return false;
    }
  }

  // Es gibt kein freies Feld mehr -> unentscheiden!
  return true;
}

function computerZugAusfuehren() {
  // Per Zufall ein Feld auswählen
  const zufallsIndex = Math.floor(Math.random() * 9);

  // Einen Spielstein auf dieses Feld setzen
  if (spielsteinSetzen(felder[zufallsIndex]) === true) {
    // Beende den Zug, wenn der Spielstein erfolgreich gesetzt wurde
    zugBeenden();
  } else {
    // Wähle ein anderes Feld, wenn das Feld schon besetzt war
    computerZugAusfuehren();
  }
}

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

const helden = {
  X: { name: 'I am Hero 1', icon: 'X' },
  O: { name: 'I am Hero 2', icon: 'O' },
};

const SIEG_KOMBINATION = [
  // [felder[0], felder[1], felder[2]],
  // [felder[3], felder[4], felder[5]],
  // [felder[6], felder[7], felder[8]],
  // [felder[0], felder[3], felder[6]],
  // [felder[1], felder[4], felder[7]],
  // [felder[2], felder[5], felder[8]],
  // [felder[0], felder[4], felder[8]],
  // [felder[2], felder[4], felder[6]],
];

overlayButton.addEventListener('click', spielStarten);

function spielStarten(helden) {
  // Das Overlay wieder verstecken, falls es bereits sichtbar ist
  overlay.classList.remove(SICHTBAR_KLASSE);

  // Die Klasse des letzten Siegers vom Overlay-Text entfernen
  overlayText.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);
  const a = (l) => (l === 0 ? '' : [a(l - 1), a(l - 1), a(l - 1)]);

  const spielfeldArr = {
    spielfeld: a(4),
  };

  // der Zufall entscheidet, wer beginnt
  let momentanerSpieler = Math.random() < 0.5 ? helden.X : helden.O;

  // zufälliges assignment des Icons

  // const zufaelligesIcon = Math.round(Math.random());
  // if (zufaelligesIcon === 0) {
  //   helden.spieler.icon = 'X';
  //   helden.gegner.icon = 'O';
  // } else {
  //   helden.spieler.icon = 'O';
  //   helden.gegner.icon = 'X';
  // }

  const settings = {
    helden,
    momentanerSpieler,
    spielfeldArr,
  };

  console.log(settings);

  uebersichtAnzeigen(settings);
  spielfeldAnzeigen(settings);
}

function klickVerarbeiten(settings, i, j, k, l) {
  // Den Klick verhindern, wenn der gegner gerade am Zug ist

  // if (settings.momentanerSpieler.name === settings.helden.O.name) {
  //   console.log('Du bist nicht dran');
  //   return;
  // }

  // Spielstein auf dieses Feld setzen
  if (spielsteinSetzen(settings, i, j, k, l) === true) {
    // Beende den Zug, wenn der Spielstein erfolgreich gesetzt wurde
    zugBeenden(settings);
  }
}

function spielsteinSetzen(settings, i, j, k, l) {
  console.log(settings.spielfeldArr.spielfeld[i][j][k]);
  // Prüfen, ob das Feld schon besetzt ist
  if (settings.spielfeldArr.spielfeld[i][j][k][l] != '') {
    return false;
  }

  settings.spielfeldArr.spielfeld[i][j][k][l] = settings.momentanerSpieler.icon;

  console.log('danach ', settings.spielfeldArr.spielfeld);
  // Signalisieren, dass der Spielstein erfolgreich gesetzt wurde
  return true;
}

const aendereSpieler = (settings) => {
  if (settings.momentanerSpieler.icon === 'X') {
    // spieler beendet seinen Zug -> zum gegner wechseln
    settings.momentanerSpieler = settings.helden.O;
  } else {
    // gegner beendet seinen Zug -> zum spieler wechseln
    settings.momentanerSpieler = settings.helden.X;
  }
  return settings;
};

function zugBeenden(settings) {
  // Prüfen, ob der spieler, der gerade an der Reihe ist, gewonnen hat
  // if (siegPruefen() === true) {
  //   // Ist das der Fall, wird das Spiel beendet
  //   spielBeenden(false);

  // zugBeenden-Funktion unterbrechen, um nicht zum anderen spieler zu wechseln
  // return;
  // }

  // Prüfen, ob ein Unentschieden entstanden ist
  // if (unentschiedenPruefen() === true) {
  //   // Ist das der Fall, wird das Spiel beendet
  //   spielBeenden(true);
  // }
  aendereSpieler(settings);
  uebersichtAnzeigen(settings);
  spielfeldAnzeigen(settings);

  // Ist der gegner an der Reihe, muss ein Computerzug ausgeführt werden
  // if (aktuelleKlasse === gegner) {
  //   setTimeout(computerZugAusfuehren, 750);
  // }
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

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

const SIEG_KOMBINATIONEN = (spielfeld, spieler) => {
  const b = spielfeld;
  const p = spieler;
  const horizontal =
    (b[0][0] === p && b[0][1] === p && b[0][2] === p) ||
    (b[1][0] === p && b[1][1] === p && b[1][2] === p) ||
    (b[2][0] === p && b[2][1] === p && b[2][2] === p);
  const vertikal =
    (b[0][0] === p && b[1][0] === p && b[2][0] === p) ||
    (b[0][1] === p && b[1][1] === p && b[2][1] === p) ||
    (b[0][2] === p && b[1][2] === p && b[2][2] === p);
  const diagonal =
    (b[0][0] === p && b[1][1] === p && b[2][2] === p) ||
    (b[2][0] === p && b[1][1] === p && b[0][2] === p);

  return horizontal || vertikal || diagonal;
};

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
  let naechstesFeld = { x: '', y: '' };

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
    naechstesFeld,
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
    zugBeenden(settings, i, j, k, l);
  }
}

function spielsteinSetzen(settings, i, j, k, l) {
  // Prüfen, ob das Feld schon besetzt ist
  if (settings.spielfeldArr.spielfeld[i][j][k][l] != '') {
    return false;
  }

  settings.spielfeldArr.spielfeld[i][j][k][l] = settings.momentanerSpieler.icon;

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

function zugBeenden(settings, i, j, k, l) {
  const spielstand = standPruefen(
    selektor(settings.spielfeldArr.spielfeld, i, j),
    settings.helden
  );

  const zuruecksetzenNaechstesFeld = () => {
    settings.naechstesFeld = { x: '', y: '' };
    return settings.naechstesFeld;
  };

  // testen ob das Feld beendet wurde
  if (
    spielstand === 'X' ||
    spielstand === 'O' ||
    spielstand === 'unentschieden'
  ) {
    zuruecksetzenNaechstesFeld();
  } else {
    // prüfen, wo das nächste Mal reingeklickt werden darf
    settings.naechstesFeld =
      standPruefen(
        selektor(settings.spielfeldArr.spielfeld, k, l),
        settings.helden
      ) === 'Spiel läuft noch'
        ? { x: k, y: l }
        : { x: '', y: '' };
  }

  spielBeenden(settings);
  aendereSpieler(settings);
  uebersichtAnzeigen(settings);
  spielfeldAnzeigen(settings);

  // Ist der gegner an der Reihe, muss ein Computerzug ausgeführt werden
  // if (aktuelleKlasse === gegner) {
  //   setTimeout(computerZugAusfuehren, 750);
  // }
}

// Selektor, der das gewollte Spielfeld aus den neun Spielfeldern raussucht
function selektor(spielfeld, x, y) {
  return spielfeld[x][y];
}

// Stand prüfen - wo steht das Spiel gerade?
function standPruefen(spielfeld, helden) {
  if (SIEG_KOMBINATIONEN(spielfeld, helden.X.icon)) {
    return helden.X.icon;
  } else if (SIEG_KOMBINATIONEN(spielfeld, helden.O.icon)) {
    return helden.O.icon;
  } else {
    for (let reihe of spielfeld) {
      for (let feld of reihe) {
        if (feld === '') {
          return 'Spiel läuft noch';
        }
      }
    }
    return 'unentschieden';
  }
}

function spielBeenden(settings) {
  const grossesSpielfeld = settings.spielfeldArr.spielfeld.map(
    (s) =>
      //s
      (s = s
        .map((r) => standPruefen(r, settings.helden))
        .map((f) => {
          switch (f) {
            case settings.helden.X.icon:
              return settings.helden.X.icon;
            case settings.helden.O.icon:
              return settings.helden.O.icon;
            case 'Spiel läuft noch':
              return '';
            case 'unentschieden':
              return '';
          }
        }))
  );

  if (standPruefen(grossesSpielfeld, settings.helden) === 'Spiel läuft noch') {
    if (settings.naechstesFeld.x === '' && settings.naechstesFeld.y === '') {
      console.log('unentschieden');
    }
  } else {
    console.log(standPruefen(grossesSpielfeld, settings.helden));
  }
  console.log(grossesSpielfeld);

  // Text für Overlay
  // if (unentschieden === true) {
  //   overlayText.innerText = 'Unentschieden!';
  // } else if (aktuelleKlasse === spieler) {
  //   overlayText.innerText = 'Du hast gewonnen!';
  //   overlayText.classList.add(spieler);
  // } else {
  //   overlayText.innerText = 'Dein Gegner hat gewonnen!';
  //   overlayText.classList.add(gegner);
  // }

  // // Das Overlay sichtbar machen
  // overlay.classList.add(SICHTBAR_KLASSE);
}

// function unentschiedenPruefen() {
//   // Gehe alle Felder durch
//   for (const feld of felder) {
//     // Prüfe, ob das Feld noch unbesetzt ist
//     if (!feld.classList.contains(spieler) && !feld.classList.contains(gegner)) {
//       // Gibt es ein unbesetztes Feld, kann es kein Unentschieden sein
//       return false;
//     }
//   }

//   // Es gibt kein freies Feld mehr -> unentscheiden!
//   return true;
// }

// function computerZugAusfuehren() {
//   // Per Zufall ein Feld auswählen
//   const zufallsIndex = Math.floor(Math.random() * 9);

//   // Einen Spielstein auf dieses Feld setzen
//   if (spielsteinSetzen(felder[zufallsIndex]) === true) {
//     // Beende den Zug, wenn der Spielstein erfolgreich gesetzt wurde
//     zugBeenden();
//   } else {
//     // Wähle ein anderes Feld, wenn das Feld schon besetzt war
//     computerZugAusfuehren();
//   }
// }

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

// Selektor, der das gewollte Spielfeld aus den neun Spielfeldern raussucht
function selektor(spielfeld, x, y) {
  return spielfeld[x][y];
}

// Spielfeld erstellen
const initialesSpielfeld = () => {
  const spielfeldGenerieren = (level) =>
    level === 0
      ? ''
      : [
          spielfeldGenerieren(level - 1),
          spielfeldGenerieren(level - 1),
          spielfeldGenerieren(level - 1),
        ];

  return spielfeldGenerieren(4);
};

const spielzustand = (zustand) => {
  const helden = {
    X: { name: 'I am Hero 1', icon: 'X' },
    O: { name: 'I am Hero 2', icon: 'O' },
  };

  // Spieler togglen
  let momentanerSpieler;
  if (!momentanerSpieler) {
    // der Zufall entscheidet, wer beginnt
    momentanerSpieler = Math.random() < 0.5 ? helden.X : helden.O;
  } else if (momentanerSpieler.icon === 'X') {
    momentanerSpieler = helden.O;
  } else {
    momentanerSpieler = helden.X;
  }

  let momentanerZug;
  if (!momentanerZug) {
    // l1-l4 stehen für die Level tiefen des vier Dim Arrays
    momentanerZug = { l1: '', l2: '', l3: '', l4: '' };
  } else {
    const { l1, l2, l3, l4 } = zustand.momentanerZug;
    momentanerZug = { l1, l2, l3, l4 };
  }

  let spielfeld;
  if (!spielfeld) {
    spielfeld = initialesSpielfeld();
  } else {
    spielfeld = zustand.spielfeld;
  }

  // in Zustand wird abgespeichert, wie das momentane Feld aussieht und wer gerade am Zug ist
  zustand = {
    helden,
    spielfeld,
    momentanerSpieler,
    momentanerZug,
  };

  return zustand;
};

function spielStarten() {
  // momentanen Zustand des Spiels laden
  let zustand = spielzustand();

  // Das Overlay wieder verstecken, falls es bereits sichtbar ist
  overlay.classList.remove(SICHTBAR_KLASSE);

  // Die Klasse des letzten Siegers vom Overlay-Text entfernen
  overlayText.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);

  console.log(zustand);

  uebersichtAnzeigen(zustand);
  spielfeldAnzeigen(zustand);
}

function zugBeginnen(zustand) {
  // Spielstein auf dieses Feld setzen
  if (zug(zustand)) {
    // Beende den Zug, wenn der Spielstein erfolgreich gesetzt wurde
    zugBeenden(zustand);
  }
}

function zug(zustand) {
  // Prüfen, ob das Feld schon besetzt ist
  let { l1, l2, l3, l4 } = zustand.momentanerZug;
  if (zustand.spielfeld[l1][l2][l3][l4] != '') {
    return false;
  }

  zustand.spielfeld[l1][l2][l3][l4] = zustand.momentanerSpieler.icon;

  // Signalisieren, dass der Spielstein erfolgreich gesetzt wurde
  return true;
}

function zugBeenden(zustand) {
  // momentanen Spielstand auslesen
  const spielstand = standPruefen(
    selektor(
      zustand.spielfeld,
      zustand.momentanerZug.l1,
      zustand.momentanerZug.l2
    ),
    zustand.helden
  );

  // testen ob das kleine Spielfeld beendet wurde
  if (
    spielstand === 'X' ||
    spielstand === 'O' ||
    spielstand === 'unentschieden'
  ) {
    // wenn das kleine Spielfeld beendet wurde, dann kann man sich ein beliebiges neues Spielfeld aussuchen
    zustand.momentanerZug = { l1: '', l2: '', l3: '', l4: '' };
  }

  // Testen, ob jemand das Spiel gewonnen hat
  spielBeenden(zustand);

  // neuen Zustand abspeichern
  let neuerZustand = spielzustand(zustand);
  uebersichtAnzeigen(neuerZustand);
  spielfeldAnzeigen(neuerZustand);
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

function spielBeenden(zustand) {
  // großes Spielfeld mit dem Gewinner des jeweiligen Feldes
  const naechstesFeld = document.getElementsByClassName('naechstesFeld');
  console.log('naechstes Feld: ', naechstesFeld);
  const grossesSpielfeld = zustand.spielfeld.map(
    (s) =>
      //s
      (s = s
        .map((r) => standPruefen(r, zustand.helden))
        .map((f) => {
          switch (f) {
            case zustand.helden.X.icon:
              return zustand.helden.X.icon;
            case zustand.helden.O.icon:
              return zustand.helden.O.icon;
            case 'Spiel läuft noch':
              return '';
            case 'unentschieden':
              return '';
          }
        }))
  );

  const standGrossesFeld = standPruefen(grossesSpielfeld, zustand.helden);

  if (standGrossesFeld === 'Spiel läuft noch') {
    if (naechstesFeld.length === 0 || standGrossesFeld === 'unentschieden') {
      overlayText.innerText = 'Unentschieden!';
      overlay.classList.add(SICHTBAR_KLASSE);
      overlayButton.addEventListener('click', spielStarten);
      return 'unentschieden';
    }
  } else {
    console.log(standGrossesFeld);
    overlayText.innerText = `${standPruefen(
      grossesSpielfeld,
      zustand.helden
    )} hat gewonnen!`;
    overlayText.classList.add('spieler' + standGrossesFeld);
    overlay.classList.add(SICHTBAR_KLASSE);
    overlayButton.addEventListener('click', spielStarten);
    return standGrossesFeld;
  }
  console.log(grossesSpielfeld);
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

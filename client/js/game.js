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

// Spielmodus bestimmen (Singleplayer, Hotseat oder Robo)
const spielmodus = () => {
  let params = new URL(document.location).searchParams;
  let modus = params.get('mode');
  return modus;
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

// speichert den momentanen Zustand des Spiels
const spielzustand = (spielzustand) => {
  let helden;

  // generiert einen witzigen Namen für den Spieler
  const zufaelligeNamen = spielerNamen.spieler.sort(() => Math.random() - 0.5);

  if (spielmodus() === 'hotseat') {
    helden = {
      X: { name: zufaelligeNamen[0], icon: 'X' },
      O: { name: zufaelligeNamen[1], icon: 'O' },
    };
  } else if (spielmodus() === 'singleplayer') {
    helden = {
      X: { name: zufaelligeNamen[0], icon: 'X' },
      O: { name: 'Robo', icon: 'O' },
    };
  }

  // Spieler togglen
  let momentanerSpieler;
  if (!spielzustand) {
    // der Zufall entscheidet, wer beginnt
    momentanerSpieler = Math.random() < 0.5 ? helden.X : helden.O;
  } else if (spielzustand.momentanerSpieler.icon === 'X') {
    momentanerSpieler = helden.O;
  } else {
    momentanerSpieler = helden.X;
  }

  let momentanerZug;
  if (!spielzustand) {
    // l1-l4 stehen für die Level tiefen des vier Dim Arrays
    momentanerZug = { l1: '', l2: '', l3: '', l4: '' };
  } else {
    const { l1, l2, l3, l4 } = spielzustand.momentanerZug;
    momentanerZug = { l1, l2, l3, l4 };
  }

  let spielfeld;
  if (!spielzustand) {
    spielfeld = initialesSpielfeld();
  } else {
    spielfeld = spielzustand.spielfeld;
  }

  // in Zustand wird abgespeichert, wie das momentane Feld aussieht und wer gerade am Zug ist
  spielzustand = {
    helden,
    spielfeld,
    momentanerSpieler,
    momentanerZug,
  };

  return spielzustand;
};

function spielStarten() {
  let zustand;
  if (spielmodus() === 'mehrspieler') {
    const status = heldZumSpielHinzufuegen().then((data) => data.status);
    if (status === 200) {
      const zustand = spielzustand();
    }
  } else {
    // momentanen Zustand des Spiels laden
    zustand = spielzustand();
  }

  // Das Overlay wieder verstecken, falls es bereits sichtbar ist
  overlay.classList.remove(SICHTBAR_KLASSE);

  // Die Klasse des letzten Siegers vom Overlay-Text entfernen
  overlayText.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);

  uebersichtAnzeigen(zustand);
  spielfeldAnzeigen(zustand);

  if (
    spielmodus() === 'singleplayer' &&
    zustand.momentanerSpieler.name === 'Robo'
  ) {
    zugBeginnen(zustand);
  }
}

function zugBeginnen(zustand) {
  if (
    spielmodus() === 'singleplayer' &&
    zustand.momentanerSpieler.name === 'Robo'
  ) {
    if (zug(macheZufaelligenZug(zustand))) zugBeenden(zustand);
  } else {
    if (zug(zustand)) zugBeenden(zustand);
  }
}

function zug(zustand) {
  // Prüfen, ob das Feld schon besetzt ist
  let { l1, l2, l3, l4 } = zustand.momentanerZug;
  if (zustand.spielfeld[l1][l2][l3][l4] != '') {
    // Falls Robo ein Feld nimmt, welches schon besetzt ist, darf er es nochmal versuchen
    if (
      spielmodus() === 'singleplayer' &&
      zustand.momentanerSpieler.name === 'Robo'
    ) {
      zustand = macheZufaelligenZug(zustand);
      console.log('He tried again: ', zustand);
    }
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

  const spielstandNaechstesFeld = standPruefen(
    selektor(
      zustand.spielfeld,
      zustand.momentanerZug.l3,
      zustand.momentanerZug.l4
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
  } else if (
    spielstandNaechstesFeld === 'X' ||
    spielstandNaechstesFeld === 'O' ||
    spielstandNaechstesFeld === 'unentschieden'
  ) {
    // wenn das nächste kleine Spielfeld beendet wurde, dann kann man sich ein beliebiges neues Spielfeld aussuchen
    zustand.momentanerZug = { l1: '', l2: '', l3: '', l4: '' };
  }

  // Testen, ob jemand das Spiel gewonnen hat
  spielBeenden(zustand);

  // neuen Zustand abspeichern
  let neuerZustand = spielzustand(zustand);
  uebersichtAnzeigen(neuerZustand);
  spielfeldAnzeigen(neuerZustand);

  if (
    spielmodus() === 'singleplayer' &&
    neuerZustand.momentanerSpieler.name === 'Robo'
  ) {
    zugBeginnen(neuerZustand);
  }
}

function spielBeenden(zustand) {
  // großes Spielfeld mit dem Gewinner des jeweiligen Feldes
  const naechstesFeld = document.getElementsByClassName('naechstes-feld');
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

  if (
    standGrossesFeld === 'Spiel läuft noch' ||
    standGrossesFeld === 'unentschieden'
  ) {
    if (naechstesFeld.length === 0) {
      overlayText.innerText = 'Unentschieden!';
      overlay.classList.add(SICHTBAR_KLASSE);
      overlayButton.addEventListener('click', spielStarten);
      return 'unentschieden';
    }
  } else {
    overlayText.innerText = `${standPruefen(
      grossesSpielfeld,
      zustand.helden
    )} hat gewonnen!`;
    overlayText.classList.add('spieler' + standGrossesFeld);
    overlay.classList.add(SICHTBAR_KLASSE);
    overlayButton.addEventListener('click', spielStarten);
    return standGrossesFeld;
  }
}

function macheZufaelligenZug(zustand) {
  // Zufällige Indizes für jede Dimension generieren

  console.log('mein Zug: ', zustand.momentanerZug);
  const koordinaten = { l1: '', l2: '', l3: '', l4: '' };

  // Wenn noch keine freie Feldwahl besteht, dann soll l1 von Koordinaten auf l3 des momentanen Zuges gesetzt werden
  if (zustand.momentanerZug.l3 !== '') {
    koordinaten.l1 = zustand.momentanerZug.l3;
  } else {
    koordinaten.l1 = Math.floor(Math.random() * zustand.spielfeld.length);
  }

  if (zustand.momentanerZug.l4 != '') {
    koordinaten.l2 = zustand.momentanerZug.l4;
  } else {
    koordinaten.l2 = Math.floor(
      Math.random() * zustand.spielfeld[koordinaten.l1].length
    );
  }

  koordinaten.l3 = Math.floor(
    Math.random() * zustand.spielfeld[koordinaten.l1][koordinaten.l2].length
  );
  koordinaten.l4 = Math.floor(
    Math.random() *
      zustand.spielfeld[koordinaten.l1][koordinaten.l2][koordinaten.l3].length
  );

  console.log('Robos Zug: ', koordinaten);

  zustand.momentanerZug = koordinaten;
  console.log('Robos Zug: ', zustand);

  // Rückgabe der aktualisierten Spielfeld-Array
  return zustand;
}

/*Fragen:
 * Warum setzt Robo manchmal ins falsche Feld?
 * Warum setzt Robo manchmal gar nicht? - erst nachdem man nochmal geklickt hat?
 */

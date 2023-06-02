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

let zufaelligeNamen;

// Spielmodus bestimmen (Singleplayer, Hotseat oder Robo)
const spielmodus = () => {
  let params = new URL(document.location).searchParams;
  return params.get('mode');
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

const heldenErstellen = () => {
  let helden;
  if (!zufaelligeNamen) {
    // generiert einen witzigen Namen für den Spieler, wenn diese nicht im Mehrspielermodus sind - IDEE: vielleicht auslagern und schon auf der Indexseite anbieten per Button?
    zufaelligeNamen = zufaelligeNamenWuerfeln();
    if (spielmodus() === 'hotseat') {
      helden = {
        X: { name: zufaelligeNamen[0], icon: 'X' },
        O: { name: zufaelligeNamen[1], icon: 'O' },
      };
    } else if (spielmodus() === 'singleplayer') {
      let nameX = !sessionStorage.getItem('name')
        ? zufaelligeNamen[0]
        : JSON.parse(sessionStorage.getItem('name'));
      helden = {
        X: { name: nameX, icon: 'X' },
        O: { name: 'Robo', icon: 'O' },
      };
    }
  }
  return helden;
};

// der Zufall entscheidet, wer beginnt
const werFaengtAn = (helden) => {
  return Math.random() < 0.5 ? helden.X : helden.O;
};

// Spieler togglen
const heldenClientSideTogglen = (data) => {
  if (data.momentanerSpieler.icon === 'X') {
    return data.helden.O;
  } else {
    return data.helden.X;
  }
};

// speichert den momentanen Zustand des Spiels
const spielzustand = async (spielzustand) => {
  let data = await spielzustand;
  let helden = await spielzustand.helden;
  let momentanerSpieler = await spielzustand.momentanerSpieler;

  console.log(data);

  if (spielmodus() !== 'mehrspieler') {
    momentanerSpieler = heldenClientSideTogglen(data);
  }

  let momentanerZug;
  if (!data || !data.momentanerZug) {
    // l1-l4 stehen für die Level tiefen des vier Dim Arrays
    momentanerZug = { l1: '', l2: '', l3: '', l4: '' };
  } else {
    const { l1, l2, l3, l4 } = data.momentanerZug;
    momentanerZug = { l1, l2, l3, l4 };
  }

  let spielfeld;
  if (!data || !data.spielfeld) {
    spielfeld = initialesSpielfeld();
  } else {
    spielfeld = data.spielfeld;
  }

  // in data wird abgespeichert, wie das momentane Feld aussieht und wer gerade am Zug ist
  data = {
    helden,
    spielfeld,
    momentanerSpieler,
    momentanerZug,
  };

  console.log(data);

  return data;
};

async function spielStarten() {
  let zustand;
  // momentanen Zustand des Spiels laden
  if (spielmodus() === 'mehrspieler') {
    zustand = await mehrspielerModus(zustand);
  } else {
    zustand = await lokalesSpiel(zustand);
  }

  console.log(zustand);

  // Das Overlay wieder verstecken, falls es bereits sichtbar ist
  overlay.classList.remove(SICHTBAR_KLASSE);

  // Die Klasse des letzten Siegers vom Overlay-Text entfernen
  overlayText.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);

  uebersichtAnzeigen(await zustand);
  spielfeldAnzeigen(await zustand);

  if (
    spielmodus() === 'singleplayer' &&
    zustand.momentanerSpieler.name === 'Robo'
  ) {
    zugBeginnen(zustand);
  } else if (spielmodus() === 'mehrspieler' && zustand.momentanerSpieler) {
  }
}

async function lokalesSpiel(zustand) {
  let helden = heldenErstellen();
  let momentanerSpieler = werFaengtAn(helden);
  zustand = await spielzustand({ helden, momentanerSpieler });
  return zustand;
}

async function mehrspielerModus(zustand) {
  if (istSpielErsteller() === false) {
    // TODO: Name vom Spieler holen
    const held2Hinzufuegen = await heldZumSpielHinzufuegen('Held 2');
    const game = await held2Hinzufuegen.json();
    console.log(game);
    if (held2Hinzufuegen.status === 200) {
      zustand = await spielzustand(game);
    }
  } else {
    const informationenHolen = localStorage.getItem('status');
    const spiel = JSON.parse(informationenHolen);
    console.log(spiel);
    zustand = await spielzustand(spiel);
  }
  return zustand;
}

function zugBeginnen(zustand) {
  if (
    spielmodus() === 'singleplayer' &&
    zustand.momentanerSpieler.name === 'Robo'
  ) {
    if (zug(macheZufaelligenZug(zustand))) {
      zugBeenden(zustand);
    }
  } else {
    if (zug(zustand)) {
      zugBeenden(zustand);
    }
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

async function zugBeenden(zustand) {
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
  let neuerZustand = await spielzustand(zustand);

  console.log('neuer Zustand', neuerZustand);

  if (spielmodus() === 'mehrspieler') {
    let update = await spielstandUpdate(neuerZustand);
    neuerZustand = await update.json();
  }

  console.log('neuer Zustand nach mehrspieler', neuerZustand);

  uebersichtAnzeigen(neuerZustand);
  spielfeldAnzeigen(neuerZustand);

  if (
    spielmodus() === 'singleplayer' &&
    neuerZustand.momentanerSpieler.name === 'Robo'
  ) {
    zugBeginnen(neuerZustand);
  } else if (spielmodus() === 'mehrspieler') {
    neuerZustand = await spielstandHolen();
    uebersichtAnzeigen(neuerZustand);
    spielfeldAnzeigen(neuerZustand);
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

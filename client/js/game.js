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

// gibt aus, ob das Feld gewonnen wurde
function booleanFeldGewonnen(spielstand) {
  return (
    spielstand === 'X' || spielstand === 'O' || spielstand === 'unentschieden'
  );
}

// erstellt ein Array basierend auf dem existierenden Spielfeld, gibt aber nur die ersten zwei Level aus
function großesFeldErstellen(zustand) {
  return zustand.spielfeld.map(
    (s) =>
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
}

// speichert den momentanen Zustand des Spiels
const spielzustand = async (spielzustand) => {
  let data = await spielzustand;
  let helden = await spielzustand.helden;
  let momentanerSpieler = await spielzustand.momentanerSpieler;

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
  const heldIdentifizieren = sessionStorageInformationen();

  // momentanen Zustand des Spiels laden
  if (spielmodus() === 'mehrspieler') {
    zustand = await mehrspielerModus(zustand);
  } else {
    zustand = await lokalesSpiel(zustand);
  }

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
  } else if (
    spielmodus() === 'mehrspieler' &&
    parseInt(heldIdentifizieren.id) !== parseInt(zustand.momentanerSpieler.id)
  ) {
    let neuerZustand = await aufSpielstandWarten(heldIdentifizieren.id);
    uebersichtAnzeigen(neuerZustand);
    spielfeldAnzeigen(neuerZustand);
  }
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
  const heldIdentifizieren = sessionStorageInformationen();

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
  if (booleanFeldGewonnen(spielstand)) {
    // wenn das kleine Spielfeld beendet wurde, dann kann man sich ein beliebiges neues Spielfeld aussuchen
    zustand.momentanerZug = { l1: '', l2: '', l3: '', l4: '' };
  } else if (booleanFeldGewonnen(spielstandNaechstesFeld)) {
    // wenn das nächste kleine Spielfeld beendet wurde, dann kann man sich ein beliebiges neues Spielfeld aussuchen
    zustand.momentanerZug = { l1: '', l2: '', l3: '', l4: '' };
  }

  // neuen Zustand abspeichern
  let neuerZustand = await spielzustand(zustand);

  if (spielmodus() === 'mehrspieler') {
    let update = await spielstandUpdate(neuerZustand);
    neuerZustand = await update.json();
  }

  uebersichtAnzeigen(neuerZustand);
  spielfeldAnzeigen(neuerZustand);

  // Testen, ob jemand das Spiel gewonnen hat
  if (spielBeenden(zustand) === true) {
    return;
  }

  if (
    spielmodus() === 'singleplayer' &&
    neuerZustand.momentanerSpieler.name === 'Robo'
  ) {
    zugBeginnen(neuerZustand);
  } else if (spielmodus() === 'mehrspieler') {
    neuerZustand = await aufSpielstandWarten(heldIdentifizieren.id);
    spielBeenden(neuerZustand);
    uebersichtAnzeigen(neuerZustand);
    spielfeldAnzeigen(neuerZustand);
  }
}

async function spielBeenden(zustand) {
  // großes Spielfeld mit dem Gewinner des jeweiligen Feldes
  const naechstesFeld = document.getElementsByClassName('naechstes-feld');
  const grossesSpielfeld = großesFeldErstellen(zustand);

  console.log(grossesSpielfeld);

  const standGrossesFeld = standPruefen(grossesSpielfeld, zustand.helden);

  if (
    standGrossesFeld === 'Spiel läuft noch' ||
    standGrossesFeld === 'unentschieden'
  ) {
    if (naechstesFeld.length === 0) {
      overlayText.innerText = 'Unentschieden!';
      overlay.classList.add(SICHTBAR_KLASSE);
      overlayButton.addEventListener('click', async () => {
        if (spielmodus() === 'mehrspieler') {
          await spielstandZuruecksetzenUndGewinnerSetzen(zustand);
        }
        spielStarten();
      });
      return true;
    }
  } else {
    if (spielmodus() === 'mehrspieler') {
      console.log('zustand vor gewinner setzen: ', zustand);
      const gewinnerId = zustand.helden[standGrossesFeld].id;
      zustand = { ...zustand, gewinner: { gewinnerId } };
      console.log('zustand nach Gewinner: ', zustand);
      await spielstandUpdate(zustand);
      await spielerListeUpdaten({ spielId: zustand.id, gewinnerId });
    }
    overlayText.innerText = `${zustand.helden[standGrossesFeld].name} hat gewonnen!`;
    overlayText.classList.add('spieler' + standGrossesFeld);
    overlay.classList.add(SICHTBAR_KLASSE);
    overlayButton.addEventListener('click', async () => {
      await spielstandZuruecksetzenUndGewinnerSetzen(zustand);
      spielStarten();
    });
    return true;
  }

  return false;
}

async function spielstandZuruecksetzenUndGewinnerSetzen(zustand) {
  zustand.momentanerZug = { l1: '', l2: '', l3: '', l4: '' };
  zustand.spielfeld = initialesSpielfeld();
  await spielstandUpdate(zustand);
}

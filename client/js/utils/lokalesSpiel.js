const heldenErstellen = () => {
  let helden;
  let spielerX = sessionStorageInformationen();
  if (spielmodus() === 'hotseat') {
    zufaelligeNamen = zufaelligeNamenWuerfelnArray();
    helden = {
      X: { id: spielerX.id, name: spielerX.name, icon: 'X' },
      O: { name: zufaelligeNamen[1], icon: 'O' },
    };
  } else if (spielmodus() === 'einzelspieler') {
    helden = {
      X: { id: spielerX.id, name: spielerX.name, icon: 'X' },
      O: { name: 'Robo', icon: 'O' },
    };
  }
  return helden;
};

// der Zufall entscheidet, wer beginnt
const werFaengtAn = (helden) => {
  return Math.random() < 0.5 ? helden.X : helden.O;
};

const momentanesSpiel = () => {
  return Math.floor(Math.random() * 1e6);
};

// Spieler togglen
const heldenClientSideTogglen = (data) => {
  if (data.momentanerSpieler.icon === 'X') {
    return data.helden.O;
  } else {
    return data.helden.X;
  }
};

async function lokalesSpiel(zustand) {
  let helden;
  let momentanesSpielId = momentanesSpiel();
  if (!zustand) {
    helden = heldenErstellen();
    zustand = await spielzustand({
      helden,
      momentanesSpiel: momentanesSpielId,
    });
  } else {
    zustand = {
      ...zustand,
      momentanesSpiel: momentanesSpielId,
      momentanerZug: { l1: '', l2: '', l3: '', l4: '' },
      spielfeld: initialesSpielfeld(),
    };
    zustand = await spielzustand(zustand);
  }

  return zustand;
}

// Hotseat

// Einzelspieler

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

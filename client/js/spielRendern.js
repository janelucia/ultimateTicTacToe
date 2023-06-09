const uebersichtAnzeigen = async (zustand) => {
  spielanzeige.innerHTML = '';

  const erstelleSpielerDiv = (spielerName, spielerIcon) => {
    const spielerDiv = document.createElement('div');
    spielerDiv.classList.add('hero');

    const spieler = document.createElement('p');
    spieler.innerText = spielerName;

    const icon = document.createElement('p');
    icon.innerText = spielerIcon;

    spielerDiv.appendChild(spieler);
    spielerDiv.appendChild(icon);

    return spielerDiv;
  };

  const spielerDivs = Object.entries(zustand.helden).map(([spieler, daten]) =>
    erstelleSpielerDiv(`Hero ${spieler}: ${daten.name}`, daten.icon)
  );

  spielerDivs.forEach((spielerDiv) => spielanzeige.appendChild(spielerDiv));

  const momentanerSpielerAnzeigen = document.createElement('p');

  const heldIdentifizieren = localStorageInformationen();

  if (spielmodus() === 'mehrspieler') {
    if (
      parseInt(heldIdentifizieren.id) === parseInt(zustand.momentanerSpieler.id)
    ) {
      momentanerSpielerAnzeigen.innerText = 'Du bist dran!';
    } else {
      momentanerSpielerAnzeigen.innerText = 'Der gegnerische Held ist am Zug!';
    }
  } else {
    if (zustand.momentanerSpieler.icon === zustand.helden.X.icon) {
      momentanerSpielerAnzeigen.innerText = `${zustand.helden.X.name} ist dran!`;
    } else {
      momentanerSpielerAnzeigen.innerText = `${zustand.helden.O.name} ist dran!`;
    }
  }

  spielanzeige.appendChild(momentanerSpielerAnzeigen);
};

const spielfeldAnzeigen = (zustand) => {
  spielfeld.innerHTML = '';

  for (let [l1, reiheGroßesSpielfeld] of zustand.spielfeld.entries()) {
    const reiheGroßesSpielfeldDiv = document.createElement('div');
    reiheGroßesSpielfeldDiv.classList.add('reihe-großes-spielfeld');

    for (let [l2, kleinesSpielfeld] of reiheGroßesSpielfeld.entries()) {
      const spielstand = standPruefen(
        selektor(zustand.spielfeld, l1, l2),
        zustand.helden
      );

      const kleinesSpielfeldDiv = document.createElement('div');
      kleinesSpielfeldDiv.classList.add('kleines-spielfeld');
      // Je nach dem, was in dem Feld steht, wird dem eine Klasse zugeordnet.
      if (spielstand === 'X') {
        renderGewinnerKleinesFeld(kleinesSpielfeldDiv, 'x');
      } else if (spielstand === 'O') {
        renderGewinnerKleinesFeld(kleinesSpielfeldDiv, 'o');
      } else if (spielstand === 'unentschieden') {
        renderGewinnerKleinesFeld(kleinesSpielfeldDiv, 'u');
      } else if (
        (l1 === zustand.momentanerZug.l3 && l2 === zustand.momentanerZug.l4) ||
        (zustand.momentanerZug.l3 === '' && zustand.momentanerZug.l4 === '')
      ) {
        kleinesSpielfeldDiv.classList.add('naechstes-feld');
      }

      for (let [l3, reiheKleinesSpielfeld] of kleinesSpielfeld.entries()) {
        const reiheKleinesSpielfeldDiv = document.createElement('div');
        reiheKleinesSpielfeldDiv.classList.add('kleines-spielfeld-reihe');

        for (let [l4, feld] of reiheKleinesSpielfeld.entries()) {
          const feldDiv = document.createElement('div');
          feldDiv.classList.add('feld');
          if (feld !== '') {
            feldDiv.innerText = feld;
          }
          feldDiv.addEventListener('click', () => {
            const heldIdentifizieren = localStorageInformationen();
            if (!kleinesSpielfeldDiv.classList.contains('naechstes-feld')) {
              return;
            } else if (spielmodus() === 'mehrspieler') {
              if (
                parseInt(heldIdentifizieren.id) !==
                parseInt(zustand.momentanerSpieler.id)
              ) {
                return;
              }
            }
            zustand.momentanerZug = { l1, l2, l3, l4 };
            zugBeginnen(zustand);
          });

          reiheKleinesSpielfeldDiv.appendChild(feldDiv);
        }

        kleinesSpielfeldDiv.appendChild(reiheKleinesSpielfeldDiv);
      }

      reiheGroßesSpielfeldDiv.appendChild(kleinesSpielfeldDiv);
    }

    spielfeld.appendChild(reiheGroßesSpielfeldDiv);
  }
};

/**
 *
 * @param {HTMLElement} element
 * @param {String} gewinner
 */
function renderGewinnerKleinesFeld(element, gewinner) {
  if (gewinner === 'U') {
    element.classList.add('unentschieden');
  } else {
    element.classList.add(`spieler-${gewinner}`);
  }

  const kleinesSpielfeldSpan = document.createElement('span');
  if (gewinner === 'U') {
    kleinesSpielfeldSpan.classList.add('unentschieden');
  } else {
    kleinesSpielfeldSpan.classList.add(`${gewinner}-gewinnt`);
  }
  kleinesSpielfeldSpan.innerText = gewinner.toLocaleUpperCase();
  element.appendChild(kleinesSpielfeldSpan);
}

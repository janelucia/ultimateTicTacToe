const uebersichtAnzeigen = async (zustand) => {
  spielanzeige.innerHTML = '';

  const erstelleSpielerDiv = (spielerName, daten, istAmZug) => {
    const spielerDiv = document.createElement('div');
    spielerDiv.classList.add('hero');

    const spieler = document.createElement('p');
    spieler.innerText = spielerName;

    const icon = document.createElement('p');
    icon.innerText = daten.icon;

    if (istAmZug && daten.icon === 'X') {
      spieler.style.color = '#00ffca';
      icon.style.color = '#00ffca';
    } else if (istAmZug && daten.icon === 'O') {
      spieler.style.color = '#09deff';
      icon.style.color = '#09deff';
    } else {
      spieler.style.color = 'gray';
      icon.style.color = 'gray';
    }

    spielerDiv.appendChild(spieler);
    spielerDiv.appendChild(icon);

    return spielerDiv;
  };

  const spielerDivs = Object.entries(zustand.helden).map(([spieler, daten]) =>
    erstelleSpielerDiv(
      `Hero ${spieler}: ${daten.name}`,
      daten,
      daten.icon === zustand.momentanerSpieler.icon
    )
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
          if (feld === 'X') {
            const symbolX = setzeIcon(zustand, l1, l2, l3, l4, feld);
            feldDiv.appendChild(symbolX);
          } else if (feld === 'O') {
            const symbolO = setzeIcon(zustand, l1, l2, l3, l4, feld);
            feldDiv.appendChild(symbolO);
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

function setzeIcon(zustand, l1, l2, l3, l4, icon) {
  const symbol = document.createElement('span');
  symbol.classList.add(icon.toLocaleLowerCase() + '-symbol');
  symbol.innerText = icon.toLocaleUpperCase();

  if (
    l1 === zustand.momentanerZug.l1 &&
    l2 === zustand.momentanerZug.l2 &&
    l3 === zustand.momentanerZug.l3 &&
    l4 === zustand.momentanerZug.l4
  ) {
    symbol.classList.add('zoom-out');
  }

  return symbol;
}

/**
 *
 * @param {HTMLElement} element
 * @param {String} gewinner
 */
function renderGewinnerKleinesFeld(element, gewinner) {
  if (gewinner === 'u') {
    element.classList.add('unentschieden');
  } else {
    element.classList.add(`${gewinner}-gewonnen`);
  }

  const kleinesSpielfeldSpan = document.createElement('span');
  if (gewinner === 'u') {
    kleinesSpielfeldSpan.classList.add('unentschieden-gespielt');
  } else {
    kleinesSpielfeldSpan.classList.add(`${gewinner}-gewinnt`);
  }

  if (gewinner === 'u') {
    kleinesSpielfeldSpan.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4v11a5 5 0 0 0 5 5h2a5 5 0 0 0 5-5V4"/></svg>';
  } else if (gewinner === 'o') {
    kleinesSpielfeldSpan.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"/></svg>';
  } else {
    kleinesSpielfeldSpan.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 15 15"><path fill="currentColor" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27Z"/></svg>';
  }
  element.appendChild(kleinesSpielfeldSpan);
}

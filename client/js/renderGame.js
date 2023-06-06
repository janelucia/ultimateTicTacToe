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

  const heldIdentifizieren = sessionStorageInformationen();

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
        kleinesSpielfeldDiv.classList.add('spieler-x');
        kleinesSpielfeldDiv.innerHTML = '<span class="x-gewinnt">X</span>';
      } else if (spielstand === 'O') {
        kleinesSpielfeldDiv.classList.add('spieler-o');
        kleinesSpielfeldDiv.innerHTML = '<span class="o-gewinnt">O</span>';
      } else if (spielstand === 'unentschieden') {
        kleinesSpielfeldDiv.classList.add('unentschieden');
        kleinesSpielfeldDiv.innerHTML = '<span class="unentschieden">U</span>';
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
            const heldIdentifizieren = sessionStorageInformationen();
            if (!kleinesSpielfeldDiv.classList.contains('naechstes-feld')) {
              return;
            } else if (spielmodus() === 'multiplayer') {
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

// position relative and absolute nutzen für positioning

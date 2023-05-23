const uebersichtAnzeigen = (zustand) => {
  spielanzeige.innerHTML = '';

  const spielerDiv = document.createElement('div');
  spielerDiv.classList.add('hero');
  const spieler = document.createElement('p');
  spieler.innerText = 'Hero 1: ' + zustand.helden.X.name;
  const icon1 = document.createElement('p');
  icon1.innerText = zustand.helden.X.icon;
  spielerDiv.appendChild(spieler);
  spielerDiv.appendChild(icon1);

  spielanzeige.appendChild(spielerDiv);

  const gegnerDiv = document.createElement('div');
  gegnerDiv.classList.add('hero');
  const gegner = document.createElement('p');
  gegner.innerText = 'Hero 2: ' + zustand.helden.O.name;
  const icon2 = document.createElement('p');
  icon2.innerText = zustand.helden.O.icon;
  gegnerDiv.appendChild(gegner);
  gegnerDiv.appendChild(icon2);

  spielanzeige.appendChild(gegnerDiv);

  const momentanerSpielerAnzeigen = document.createElement('p');
  if (zustand.momentanerSpieler.name === zustand.helden.X.name) {
    momentanerSpielerAnzeigen.innerText = 'Du bist dran!';
  } else {
    momentanerSpielerAnzeigen.innerText = 'Dein:e Gegner:in ist am Zug!';
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
      if (spielstand === 'X') {
        kleinesSpielfeldDiv.classList.add('spieler-x');
        kleinesSpielfeldDiv.innerText = 'X';
      } else if (spielstand === 'O') {
        kleinesSpielfeldDiv.classList.add('spieler-o');
        kleinesSpielfeldDiv.innerText = 'O';
      } else if (spielstand === 'unentschieden') {
        kleinesSpielfeldDiv.classList.add('unentschieden');
        kleinesSpielfeldDiv.innerText = 'U';
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
            if (!kleinesSpielfeldDiv.classList.contains('naechstes-feld')) {
              return;
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

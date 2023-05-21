const uebersichtAnzeigen = (settings) => {
  spielanzeige.innerHTML = '';

  const spielerDiv = document.createElement('div');
  spielerDiv.classList.add('hero');
  const spieler = document.createElement('p');
  spieler.innerText = 'Hero 1: ' + settings.helden.X.name;
  const icon1 = document.createElement('p');
  icon1.innerText = settings.helden.X.icon;
  spielerDiv.appendChild(spieler);
  spielerDiv.appendChild(icon1);

  spielanzeige.appendChild(spielerDiv);

  const gegnerDiv = document.createElement('div');
  gegnerDiv.classList.add('hero');
  const gegner = document.createElement('p');
  gegner.innerText = 'Hero 2: ' + settings.helden.O.name;
  const icon2 = document.createElement('p');
  icon2.innerText = settings.helden.O.icon;
  gegnerDiv.appendChild(gegner);
  gegnerDiv.appendChild(icon2);

  spielanzeige.appendChild(gegnerDiv);

  const momentanerGamer = document.createElement('p');
  if (settings.momentanerSpieler.name === settings.helden.X.name) {
    momentanerGamer.innerText = 'Du bist dran!';
  } else {
    momentanerGamer.innerText = 'Dein:e Gegner:in ist am Zug!';
  }

  spielanzeige.appendChild(momentanerGamer);
};

const spielfeldAnzeigen = (settings) => {
  spielfeld.innerHTML = '';

  for (let [
    i,
    reiheSpielfelderArr,
  ] of settings.spielfeldArr.spielfeld.entries()) {
    const reiheSpielfelderDiv = document.createElement('div');
    reiheSpielfelderDiv.classList.add('rowBoards');

    for (let [j, reiheSpielfeldArr] of reiheSpielfelderArr.entries()) {
      const spielstand = standPruefen(
        selektor(settings.spielfeldArr.spielfeld, i, j),
        settings.helden
      );
      const reiheSpielfeldDiv = document.createElement('div');
      reiheSpielfeldDiv.classList.add('rowBoard');
      if (spielstand === 'X') {
        reiheSpielfeldDiv.classList.add('spielerX');
        reiheSpielfeldDiv.innerText = 'X';
      } else if (spielstand === 'O') {
        reiheSpielfeldDiv.classList.add('spielerO');
        reiheSpielfeldDiv.innerText = 'O';
      } else if (spielstand === 'unentschieden') {
        reiheSpielfeldDiv.classList.add('unentschieden');
        reiheSpielfeldDiv.innerText = 'U';
      } else if (
        (i === settings.naechstesFeld.x && j === settings.naechstesFeld.y) ||
        (settings.naechstesFeld.x === '' && settings.naechstesFeld.y === '')
      ) {
        reiheSpielfeldDiv.classList.add('naechstesFeld');
      }

      for (let [k, reiheArr] of reiheSpielfeldArr.entries()) {
        const reiheDiv = document.createElement('div');
        reiheDiv.classList.add('row');

        for (let [l, feld] of reiheArr.entries()) {
          const feldDiv = document.createElement('div');
          feldDiv.classList.add('feld');
          if (feld !== '') {
            feldDiv.innerText = feld;
          }
          feldDiv.addEventListener('click', () => {
            if (!reiheSpielfeldDiv.classList.contains('naechstesFeld')) {
              return;
            }
            klickVerarbeiten(settings, i, j, k, l);
          });

          reiheDiv.appendChild(feldDiv);
        }

        reiheSpielfeldDiv.appendChild(reiheDiv);
      }

      reiheSpielfelderDiv.appendChild(reiheSpielfeldDiv);
    }

    spielfeld.appendChild(reiheSpielfelderDiv);
  }
};

// position relative and absolute nutzen für positioning

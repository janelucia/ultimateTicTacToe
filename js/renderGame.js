const uebersichtAnzeigen = (helden, momentanerSpieler) => {
  const spielerDiv = document.createElement('div');
  spielerDiv.classList.add('hero');
  const spieler = document.createElement('p');
  spieler.innerText = 'Hero 1: ' + helden.spieler.name;
  const icon1 = document.createElement('p');
  icon1.innerText = helden.spieler.icon;
  spielerDiv.appendChild(spieler);
  spielerDiv.appendChild(icon1);

  spielanzeige.appendChild(spielerDiv);

  const gegnerDiv = document.createElement('div');
  gegnerDiv.classList.add('hero');
  const gegner = document.createElement('p');
  gegner.innerText = 'Hero 2: ' + helden.gegner.name;
  const icon2 = document.createElement('p');
  icon2.innerText = helden.gegner.icon;
  gegnerDiv.appendChild(gegner);
  gegnerDiv.appendChild(icon2);

  spielanzeige.appendChild(gegnerDiv);

  const momentanerGamer = document.createElement('p');
  if (momentanerSpieler === helden.spieler.name) {
    momentanerGamer.innerText = 'Du bist dran!';
  } else {
    momentanerGamer.innerText = 'Dein:e Gegner:in ist am Zug!';
  }

  spielanzeige.appendChild(momentanerGamer);
};

const spielfeldAnzeigen = (helden, momentanerSpieler) => {
  for (let reiheSpielfelderArr of anfangsspielfeld.spielfeld) {
    const reiheSpielfeldDiv = document.createElement('div');
    reiheSpielfeldDiv.classList.add('rowBoards');

    for (let reiheSpielfeldArr of reiheSpielfelderArr) {
      const rowBoardDiv = document.createElement('div');
      rowBoardDiv.classList.add('rowBoard');

      for (let reiheArr of reiheSpielfeldArr) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        for (let feld of reiheArr) {
          const feldDiv = document.createElement('div');
          feldDiv.classList.add('feld');
          feldDiv.textContent = feld;
          feldDiv.addEventListener('click', () => {
            klickVerarbeiten(helden, momentanerSpieler);
          });

          rowDiv.appendChild(feldDiv);
        }

        rowBoardDiv.appendChild(rowDiv);
      }

      reiheSpielfeldDiv.appendChild(rowBoardDiv);
    }

    spielfeld.appendChild(reiheSpielfeldDiv);
  }
};

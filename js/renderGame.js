const gameOverviewRender = (heroes, currentPlayer) => {
  const spielerDiv = document.createElement('div');
  spielerDiv.classList.add('hero');
  const spieler = document.createElement('p');
  spieler.innerText = 'Hero 1: ' + heroes.spieler.name;
  const icon1 = document.createElement('p');
  icon1.innerText = heroes.spieler.icon;
  spielerDiv.appendChild(spieler);
  spielerDiv.appendChild(icon1);

  spielanzeige.appendChild(spielerDiv);

  const gegnerDiv = document.createElement('div');
  gegnerDiv.classList.add('hero');
  const gegner = document.createElement('p');
  gegner.innerText = 'Hero 2: ' + heroes.gegner.name;
  const icon2 = document.createElement('p');
  icon2.innerText = heroes.gegner.icon;
  gegnerDiv.appendChild(gegner);
  gegnerDiv.appendChild(icon2);

  spielanzeige.appendChild(gegnerDiv);

  const currentGamer = document.createElement('p');
  if (currentPlayer === spieler) {
    currentGamer.innerText = 'Du bist dran!';
  } else {
    currentGamer.innerText = 'Dein:e Gegner:in ist am Zug!';
  }

  spielanzeige.appendChild(currentGamer);
};

const boardRender = (currentGamer) => {
  for (let rowBoardsArr of initialBoardArr.board) {
    const rowBoardsDiv = document.createElement('div');
    rowBoardsDiv.classList.add('rowBoards');

    for (let rowBoardArr of rowBoardsArr) {
      const rowBoardDiv = document.createElement('div');
      rowBoardDiv.classList.add('rowBoard');

      for (let rowArr of rowBoardArr) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');

        for (let feld of rowArr) {
          const feldDiv = document.createElement('div');
          feldDiv.classList.add('feld');
          feldDiv.textContent = feld;
          feldDiv.addEventListener('click', () => {
            klickVerarbeiten;
          });

          rowDiv.appendChild(feldDiv);
        }

        rowBoardDiv.appendChild(rowDiv);
      }

      rowBoardsDiv.appendChild(rowBoardDiv);
    }

    spielfeld.appendChild(rowBoardsDiv);
  }

  console.log(initialBoardArr);
};

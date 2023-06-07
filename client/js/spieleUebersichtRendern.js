async function spielerInfos() {
  let json = await spielerHolen();
  let data = await json.json();

  let countGespielt = data.spiele.length;
  let countSingleplayer = 0;
  let countHotseat = 0;
  let countMehrspieler = 0;
  let countGewinner = 0;

  for (let i = 0; i < data.spiele.length; i++) {
    if (data.spiele[i].gewinner === true) {
      countGewinner++;
    }
    if (data.spiele[i].spielmodus === 'singleplayer') {
      countSingleplayer++;
    } else if (data.spiele[i].spielmodus === 'hotseat') {
      countHotseat++;
    } else {
      countMehrspieler++;
    }
  }

  console.log(countGespielt);

  return {
    held: data.name,
    countGespielt,
    countGewinner,
    countSingleplayer,
    countHotseat,
    countMehrspieler,
  };
}

async function renderSpieleUebersicht() {
  const data = await spielerInfos();

  const profilNameP = document.createElement('p');
  profilNameP.innerText = data.held;
  profilNameDiv.appendChild(profilNameP);

  const gespielteSpieleSpan = document.createElement('span');
  gespielteSpieleSpan.innerText = data.countGespielt;
  gespielteSpieleHeader.appendChild(gespielteSpieleSpan);

  const gewonneneSpieleSpan = document.createElement('span');
  gewonneneSpieleSpan.innerText = data.countGewinner;
  gewonneneSpieleHeader.appendChild(gewonneneSpieleSpan);

  const gewonneneSingleplayerSpan = document.createElement('span');
  gewonneneSingleplayerSpan.innerText = data.countSingleplayer;
  gewonnenSingleplayerUl.appendChild(gewonneneSingleplayerSpan);

  const gewonneneHotseatSpan = document.createElement('span');
  gewonneneHotseatSpan.innerText = data.countHotseat;
  gewonnenHotseatUl.appendChild(gewonneneHotseatSpan);

  const gewonneneMehrspielerSpan = document.createElement('span');
  gewonneneMehrspielerSpan.innerText = data.countMehrspieler;
  gewonnenmehrspielerUl.appendChild(gewonneneMehrspielerSpan);
}

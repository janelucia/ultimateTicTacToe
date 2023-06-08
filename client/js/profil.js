async function spielerInfos() {
  let json = await spielerHolen();
  let data = await json.json();

  let zaehlenGespielt = data.spiele.length;
  let zaehlenEinzelspieler = 0;
  let zaehlenHotseat = 0;
  let zaehlenMehrspieler = 0;
  let zaehlenGewinner = 0;

  for (let i = 0; i < data.spiele.length; i++) {
    if (data.spiele[i].gewinner === true) {
      zaehlenGewinner++;
    }
    if (data.spiele[i].spielmodus === 'einzelspieler') {
      zaehlenEinzelspieler++;
    } else if (data.spiele[i].spielmodus === 'hotseat') {
      zaehlenHotseat++;
    } else {
      zaehlenMehrspieler++;
    }
  }

  console.log(zaehlenGespielt);

  return {
    held: data.name,
    zaehlenGespielt,
    zaehlenGewinner,
    zaehlenEinzelspieler,
    zaehlenHotseat,
    zaehlenMehrspieler,
  };
}

async function renderSpieleUebersicht() {
  const data = await spielerInfos();

  const profilNameP = document.createElement('p');
  profilNameP.innerText = data.held;
  profilNameDiv.appendChild(profilNameP);

  const gespielteSpieleSpan = document.createElement('span');
  gespielteSpieleSpan.innerText = data.zaehlenGespielt;
  gespielteSpieleHeader.appendChild(gespielteSpieleSpan);

  const gewonneneSpieleSpan = document.createElement('span');
  gewonneneSpieleSpan.innerText = data.zaehlenGewinner;
  gewonneneSpieleHeader.appendChild(gewonneneSpieleSpan);

  const gewonneneEinzelspielerSpan = document.createElement('span');
  gewonneneEinzelspielerSpan.innerText = data.zaehlenEinzelspieler;
  gewonnenEinzelspielerUl.appendChild(gewonneneEinzelspielerSpan);

  const gewonneneHotseatSpan = document.createElement('span');
  gewonneneHotseatSpan.innerText = data.zaehlenHotseat;
  gewonnenHotseatUl.appendChild(gewonneneHotseatSpan);

  const gewonneneMehrspielerSpan = document.createElement('span');
  gewonneneMehrspielerSpan.innerText = data.zaehlenMehrspieler;
  gewonnenmehrspielerUl.appendChild(gewonneneMehrspielerSpan);
}

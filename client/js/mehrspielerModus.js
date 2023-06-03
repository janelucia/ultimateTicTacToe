async function mehrspielerModus(zustand) {
  let heldInformationenHolen = sessionStorageInformationen();
  if (!heldInformationenHolen.name) {
    const zufaelligerName = sessionStorageNameSetzen();
    heldInformationenHolen = {
      ...heldInformationenHolen,
      name: zufaelligerName[0],
    };
  }

  const spielInformationen = await spielstandHolen();

  if (heldInformationenHolen.id !== spielInformationen.helden.X.id) {
    const held2Hinzufuegen = await heldZumSpielHinzufuegen(
      heldInformationenHolen
    );
    const game = await held2Hinzufuegen.json();
    console.log(game);
    if (held2Hinzufuegen.status === 200) {
      zustand = await spielzustand(game);
    }
  } else {
    const informationenHolen = spielInformationen;
    zustand = await spielzustand(informationenHolen);
  }

  return zustand;
}

async function istSpielErsteller() {
  const heldInfo = sessionStorageInformationen();
  const spiel = await spielstandHolen();
  console.log(spiel);
  return spiel.helden.X.id === heldInfo.id;
}

// Darstellung auf verschiedenen Seiten, wenn der Mehrspieler-Modus genutzt wird

const linkRendern = async (spielErstellen) => {
  const linkAnzeigen = document.getElementById('mehrspieler-link');
  // TODO richtigen Path raussuchen
  linkAnzeigen.innerHTML = `client/lobby.html?spielBeitreten=${spielErstellen.location}`;
};

function gegnerIndexSeiteRendern() {
  // rechte Seite holen und alles entfernen, was nicht mit Input zu tun hat
  const spielId = spielIdHolen();
  const spielLink = `game.html?mode=mehrspieler&spielBeitreten=${spielId}`;

  const rechteSeite = document.getElementsByClassName('rechte-seite');
  const children = rechteSeite[0].children;

  // buttons entfernen, die nicht geklickt werden sollen

  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];

    const classNames = child.getAttribute('class');
    const hasInput =
      classNames &&
      (classNames.includes('input') ||
        classNames.includes('spielernamen-input'));

    if (!hasInput && !child.getAttribute('input')) {
      rechteSeite[0].removeChild(child);
    }
  }

  // Button zum Spiel beitreten erstellen
  const divButton = document.createElement('div');
  divButton.classList.add('einzel-mehrspieler');

  const button = document.createElement('a');
  button.setAttribute('href', spielLink);
  button.innerText = 'Spiel beitreten!';

  divButton.appendChild(button);
  rechteSeite[0].appendChild(divButton);
}

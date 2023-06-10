async function mehrspielerModus(zustand) {
  let heldInformationenHolen = localStorageInformationen();

  const spielInformationen = await spielstandHolen();

  console.log('spielinfos: ', spielInformationen);

  if (
    !spielInformationen.helden.O &&
    heldInformationenHolen.id !== spielInformationen.helden.X.id
  ) {
    const held2Hinzufuegen = await heldZumSpielHinzufuegen(
      heldInformationenHolen
    );
    const spiel = await held2Hinzufuegen.json();
    if (held2Hinzufuegen.status === 200) {
      zustand = await spielzustand(spiel);
    }
  } else {
    zustand = await spielzustand(spielInformationen);
  }

  return zustand;
}

// Darstellung auf verschiedenen Seiten, wenn der Mehrspieler-Modus genutzt wird

const linkRendern = async (spielErstellen) => {
  const linkAnzeigen = document.getElementById('mehrspieler-link');
  // TODO richtigen Path raussuchen
  linkAnzeigen.innerHTML = `client/pages/lobby.html?spielBeitreten=${spielErstellen.location}`;
};

function gegnerIndexSeiteRendern() {
  // rechte Seite holen und alles entfernen, was nicht mit Input zu tun hat
  const spielId = lobbyIdHolen();
  const spielLink = `spiel.html?mode=mehrspieler&spielBeitreten=${spielId}`;

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

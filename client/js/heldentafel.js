const spielerListeHolen = async () => {
  const json = await alleSpielerHolen();
  const spieler = await json.json();
  console.log(spieler);

  const spielerMitGewonnenSpielen = spieler
    .filter((spieler) =>
      spieler.spiele.some((spiel) => spiel.gewinner === true)
    )
    .map((spieler) => ({
      ...spieler,
      spiele: spieler.spiele
        .filter((spiel) => spiel.gewinner === true)
        .sort((spielA, spielB) => spielA.zuegeGewinner - spielB.zuegeGewinner),
    }));

  console.log('1', spielerMitGewonnenSpielen);

  const sortieren = spielerMitGewonnenSpielen.sort((spielerA, spielerB) => {
    const zuegeA = spielerA.spiele.reduce(
      (min, spiel) => Math.min(min, spiel.zuegeGewinner),
      Infinity
    );
    const zuegeB = spielerB.spiele.reduce(
      (min, spiel) => Math.min(min, spiel.zuegeGewinner),
      Infinity
    );
    return zuegeA - zuegeB;
  });

  console.log('2', sortieren);
  renderHeldentafel(spielerMitGewonnenSpielen);
};

function renderHeldentafel(sortiertesArr) {
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  sortiertesArr.forEach((spieler) => {
    const { name, spiele } = spieler;
    const minZuegeGewinner = Math.min(
      ...spiele.map((spiel) => spiel.zuegeGewinner)
    );
    const spielmodus = spiele.find(
      (spiel) => spiel.zuegeGewinner === minZuegeGewinner
    ).spielmodus;

    const reihe = table.insertRow();
    const nameZelle = reihe.insertCell();
    const zuegeZelle = reihe.insertCell();
    const spielmodusZelle = reihe.insertCell();

    nameZelle.textContent = name;
    zuegeZelle.textContent = minZuegeGewinner.toString();
    spielmodusZelle.textContent = spielmodus.toLowerCase();
  });
}

const linkAnzeigen = document.getElementById('mehrspieler-link');

const linkRendern = (spielErstellen) => {
  const data = spielErstellen;
  // TODO richtigen Path raussuchen
  linkAnzeigen.innerHTML = `127.0.0.1/game.html?mode=mehrspieler&joinGame=${data.location}`;
};

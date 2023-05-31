const linkAnzeigen = document.getElementById('mehrspieler-link');

const linkRendern = async (spielErstellen) => {
  // TODO richtigen Path raussuchen
  linkAnzeigen.innerHTML = `127.0.0.1/game.html?mode=mehrspieler&joinGame=${spielErstellen.location}`;
};

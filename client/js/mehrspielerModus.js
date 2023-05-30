const linkAnzeigen = document.getElementById('mehrspieler-link');

const linkRendern = async (spielErstellen) => {
  const data = await spielErstellen;
  // TODO richtigen Path raussuchen
  linkAnzeigen.innerHTML = `127.0.0.1/game.html?mode=mehrspieler&joinGame=${data.location}`;
};

const linkAnzeigen = document.getElementById('mehrspieler-link');

const linkRendern = async () => {
  const data = await neuesMehrspielerSpiel();
  // TODO richtigen Path raussuchen
  linkAnzeigen.innerHTML = `127.0.0.1/game.html?mode=mehrspieler&joinGame=${data.location}`;
};

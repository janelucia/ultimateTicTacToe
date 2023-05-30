// richtige Seite laden
document.addEventListener('DOMContentLoaded', async () => {
  const currentPath = window.location.pathname;
  if (currentPath.endsWith('/gegnersuche.html')) {
    await neuesMehrspielerSpiel();
  } else if (currentPath.endsWith('/game.html')) {
    spielmodus();
  }
});

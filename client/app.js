// richtige Seite laden
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  if (currentPath.endsWith('/gegnersuche.html')) {
    linkRendern();
  } else if (currentPath.endsWith('/game.html')) {
    spielmodus();
  }
});

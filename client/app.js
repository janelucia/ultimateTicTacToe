// richtige Seite laden
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  if (currentPath.endsWith('/gegnersuche.html')) {
    fetch('http://localhost:3000/game')
      .then((data) => data.json())
      .then((data) => console.log(data));
    neuesMehrspielerSpiel();
  } else if (currentPath.endsWith('/game.html')) {
    spielStarten();
  }
});

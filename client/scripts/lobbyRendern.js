function heldenNamenInputRendern() {
  const ueberschrift = document.querySelector('h2.input');

  const localStorageName = localStorage.getItem('name');

  ueberschrift.innerText = `Herzlich Willkommen, ${
    !localStorageName ? 'Spieler!' : localStorageName
  }`;

  let input = document.getElementById('spielername');
  input.value = localStorageName;
}

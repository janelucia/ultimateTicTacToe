const spielerListeHolen = async () => {
  const json = await alleSpielerHolen();
  const data = await json.json();

  console.log(data);
};

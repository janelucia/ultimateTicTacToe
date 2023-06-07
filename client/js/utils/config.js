// Konstanten für den service
const SERVER_URL = 'http://localhost:3000';
const LOBBY_ENDPOINT = `${SERVER_URL}/lobby`;
const SPIELER_ENDPOINT = `${SERVER_URL}/spieler`;
const PULL_TIMEOUT = 1000;

// Konstanten für das Spiel
const SICHTBAR_KLASSE = 'sichtbar';

const spielfeld = document.querySelector('.spielfeld');
const spielanzeige = document.querySelector('.spielanzeige');
const overlay = document.querySelector('.overlay');
const overlayText = document.querySelector('.overlay-text');
const overlayButton = document.querySelector('.overlay-button');

let zufaelligeNamen;

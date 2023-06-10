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
const overlayButtonWeiterspielen = document.querySelector('.btn-weiterspielen');
const overlayButtonZurueck = document.querySelector('.btn-zurueck');

let zufaelligeNamen;

// Profil rendern
const profilNameDiv = document.querySelector('.profil-spielername');

// Konstanten, um die Spieleuebersicht zu Rendern
const gespielteSpieleHeader = document.querySelector('.gespielte-spiele');
const gewonneneSpieleHeader = document.querySelector('.gewonnene-spiele');
const gewonnenEinzelspielerHeader = document.querySelector(
  '.gewonnen-einzelspieler'
);
const gewonnenHotseatHeader = document.querySelector('.gewonnen-hotseat');
const gewonnenmehrspielerHeader = document.querySelector(
  '.gewonnen-mehrspieler'
);

// Heldentafel
const table = document.querySelector('table');

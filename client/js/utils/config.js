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

// Profil rendern
const profilNameDiv = document.querySelector('.profil-spielername');

// Konstanten, um die Spieleuebersicht zu Rendern
const gespielteSpieleHeader = document.querySelector('.gespielte-spiele');
const gewonneneSpieleHeader = document.querySelector('.gewonnene-spiele');
const gewonnenSingleplayerUl = document.querySelector('.gewonnen-singleplayer');
const gewonnenHotseatUl = document.querySelector('.gewonnen-hotseat');
const gewonnenmehrspielerUl = document.querySelector('.gewonnen-mehrspieler');

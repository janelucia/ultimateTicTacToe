// Konstanten für den service
const SERVER_URL = 'http://localhost:3000';
const GAME_ENDPOINT = `${SERVER_URL}/game`;
const SPIELER_ENDPOINT = `${SERVER_URL}/spieler`;
const PULL_TIMEOUT = 1000;

// Konstanten für das Spiel
const SPIELFELD_KLASSE = 'spielfeld';
const SPIELANZEIGE_KLASSE = 'spielanzeige';
const FELD_KLASSE = 'feld';
const SPIELER_KLASSE = 'spieler';
const GEGNER_KLASSE = 'gegner';
const OVERLAY_KLASSE = 'overlay';
const OVERLAY_TEXT_KLASSE = 'overlay-text';
const OVERLAY_BUTTON_KLASSE = 'overlay-button';
const SICHTBAR_KLASSE = 'sichtbar';

const spielfeld = document.querySelector('.' + SPIELFELD_KLASSE);
const spielanzeige = document.querySelector('.' + SPIELANZEIGE_KLASSE);
const overlay = document.querySelector('.' + OVERLAY_KLASSE);
const overlayText = document.querySelector('.' + OVERLAY_TEXT_KLASSE);
const overlayButton = document.querySelector('.' + OVERLAY_BUTTON_KLASSE);

let zufaelligeNamen;

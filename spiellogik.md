1. Spielerin 1 wählt ein kleines Tic Tac Toe Feld aus, in welches sie ihr Zeichen setzen möchte
2. Der Zug ist beendet, wenn Spielerin 1 ihr Feld mit ihrem Zeichen markiert und legt damit auch fest, in welches Feld Spielerin 2 ihr Zeichen setzen muss
3. Wenn ein kleines Tic Tac Toe Feld gewonnen wurde, dann wird das Zeichen derjenigen Spielerin in das große Tic Tac Toe Feld eingesetzt und die nächste Spielerin darf ihr Feld aus den übrigen aussuchen
4. Die Spielerin, die zu erst eine diagonale, vertikale oder horizontale Linie des großen Tic Tac Toe Feldes erobert hat, hat gewonnen
## unentschieden
5. ein kleines Feld, welches Unentschieden ausgeht, wird als unentschieden gewertet und die Spielerin, die als nächstes an der Reihe ist, darf sich ein anderes kleines Feld aus den übrigen aussuchen
6. Wenn das große Tic Tac Toe Feld als unentschieden gewertet wird, ist das Spiel unentschieden

## Pseudocode
* wenn auf Spielfeld geklickt
    * selektieren, welches Feld gemeint ist 
    * prüfen ob Feld von Array frei ist 
    * ja: Array mit Wert von Spieler befüllen. 
    * nein: Befüllung verweigern
* Spielstand prüfen 
    * Sieg für Spieler A? 
        * ja: zurückgeben, dass kleines Feld gewonnen wurde und prüfen, ob auch großes Feld gewonnen wurde
    * Sieg für Spieler B?
        * ja: zurückgeben, dass kleines Feld gewonnen wurde und prüfen, ob auch großes Feld gewonnen wurde
    * Spiel läuft noch?
        * return
    * Unentschieden?
        * Unentschieden in das Feld reinschreiben
* nächstes Feld ermitteln, in dem weiter gespielt wird
    * wenn das nächste Feld schon gewonnen oder unentschieden ist -> freie Feldwahl
* Spieler wechseln und das nächste Spielfeld mitgeben, alle anderen sperren, falls nicht freie Feldwahl ist

letzter commit, um wieder auf dem vorherigen Stand zu sein: 1e5e4c0

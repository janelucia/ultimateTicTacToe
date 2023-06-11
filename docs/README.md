# ultimateTicTacToe

Der ultimative Spielspaß mit dem Klassiker.

## Spielkonzept
Ultimate Tic Tac Toe, auch Meta Tic Tac Toe genannt, übernimmt die Prinzipien des normalen Tic Tac Toe Spiels mit der Erweiterung, dass in jedem Tic Tac Toe Feld wiederrum ein weiteres kleines Tic Tac Toe Spielfeld vorhanden ist. 

Ziel der kleinen Spielfelder und des großen Spielfeldes: eine Reihe von drei X- oder O-Markierungen horizontal, vertikal oder diagonal erst in einem der kleinen und dann im großen Spielfeld erzielen.

1. Sobald ein Spieler einen Zug gemacht hat, bestimmt das Feld, in dem er gesetzt hat, welches kleine Spielfeld der Gegner als nächstes spielen muss.
2. Der Gegner muss sein nächstes Symbol in dem kleinen Spielfeld platzieren, das dem Feld des vorherigen Spielers entspricht. Das nächste Feld ist durch einen korallen farbenden Rahmen gekennzeichnet. 
3. Es gibt zwei Möglichkeiten sich ein Feld frei auszuwählen:
  * entweder man beginnt das Spiel
  * oder der Gegner schickt einen in ein Spielfeld, welches schon gewonnen oder unentschieden wurde.
4. Das Spiel endet, wenn entweder das große Spielfeld gewonnen oder unentschieden gespielt wurde.

Viel Spaß beim Spielen von Ultimate Tic Tac Toe!

## Bedienung
- Der Server läuft über pm2 in einer Endlosschleife. Wenn der Code über das Terminal ausgeführt wird, dann muss: 
    `npm install && npm run dev`
  im Server Folder ausgeführt werden.
- in development läuft die Seite über `localhost:3000`.
- in production ist die Seite nur über HTTPS unter: https://tictacthetoe.de erreichbar.

## Komplexität (min. 6)

- 3 Punkte Desktop und Mobile: 
Unser Spiel wurde mit einem responsiven Design entwickelt, das es den Spielern ermöglicht, es sowohl auf Desktop- als auch auf Mobilgeräten zu spielen. Das bedeutet, dass die Benutzeroberfläche und das Spielfeld dynamisch an die Bildschirmgröße des Geräts angepasst werden. Die kleinste Größe die verwendet werden kann, ist das IPhone SE mit 375px in der Breite. (Katharina)

- 1 Punkt Tastatur, Maus, Buttons: 
Unser Spiel bietet eine intuitive Benutzeroberfläche, bei der Spieler ihre Spielzüge einfach durch Mausklicks auf das gewünschte Feld platzieren können. Die Tastatur kann genutzt werden, um den Spielernamen einzugeben. Darüber hinaus haben wir einen praktischen Neustart-Button implementiert, der es den Spielern ermöglicht, das Spiel nach einem Sieg oder einer Niederlage problemlos neu zu starten. (Jane/Katharina)

- 1 Punkt rundenbasiert: 
Unser Spiel verwendet eine rundenbasierte Spielweise, bei der das Spielfeld aus neun kleinen TicTacToe-Feldern besteht. Die Spieler tätigen nacheinander ihre Züge und müssen zu erst die kleinen TicTacToe-Felder gewinnen, bevor sie das große gewinnen können. (Jane/Katharina)

- 1 Punkt rasterbasiert: 
Ein TicTacToe-Spielfeld bietet sich natürlich als rasterbasiertes Spiel an, da aus einen Hauptgitter von 3x3 Feldern besteht. In jedem dieser Felder befindet sich ein weiteres kleineres Gitter mit einer Größe von 3x3. (Jane)

- 2 Punkte übers Netzwerk
Alle Spiele werden pro Spieler über die ID gespeichert auf dem Server gespeichert und in der Profilliste ausgegeben. Mit Ausnahme des 'Robo's im Einzelspieler-Modus und dem Spieler O im Hotseat-Modus (lokales Mehrspielerspiel). Da die ID für den Spieler im localstorage gespeichert und pro Browser vergeben wird. Somit haben weder Robo, noch Spieler O im Hotseat-Modus eine ID. 
Der Mehrspielermodus läuft über eine ID, die im path eines Links weitergegeben und dort gehalten wird. Der State wird über den Server weitergegeben und geholt. Deshalb ist der Mehrspielermodus reload safe. Einzelspieler und Hotseat sind nicht reload safe - der State geht mit dem reload verloren. (Jane)

- Identifikation
Die Identifikation wird über die zufällige Zuweisung einer ID, welche im localstorage gespeichert wird, geregelt. Somit kann man sich nicht browserübergreifend anmelden, sondern nur einen Spieler pro Browser erstellen. Jedoch kann man sich den Namen immer wieder neu aussuchen.

- Heldentafel (Bestenliste)
In der Heldentafel stehen die Spieler, die mindestens ein Spiel gewonnen haben. Der beste Spieler ist der, der ein Spiel mit den wenigsten Zügen gewonnen hat. Die Reihenfolge ist: 1. Platz ist in der ersten Reihe. Dazu wird der Spielmodus angezeigt, jedoch zählt nur ein Spiel pro Spieler mit den wenigsten Zügen. Die Heldentafel wird aus der Liste der Spiele der Spieler generiert, welche serverseitig gespeichert ist.

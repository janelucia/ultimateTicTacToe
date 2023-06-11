# ultimateTicTacToe

Der ultimative Spielspaß mit dem Klassiker.

## To Do
* wie wird zwischen Hotseat, Mehr- und Einzelspieler unterschieden? eigene js Seiten, die auf Funktionen in der game.js zu greifen, aber eigene Abläufe haben? Wie Klick verhindern, wenn der andere dran ist, bei Mehr- und Einzelspieler, aber bei Hotseat erlauben?

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
  - wie wird es gestartet?
  - es ist reload safe (die anderen Spielmodi sind nicht reload safe, da der Zustand nicht über Localhost weitergegeben wird)
  - der Mehrspielermodus kann nur von einem Browser aus gestartet werden, da die ID im localhost steht und diese für die Identifikation genutzt wird.


## Zusätzlich

- eine Einzelspieler Version zu erstellen
- Historien und Bestenliste mittels eigenen User Agent
- Anmeldung (keine externen Dienste) für Netzwerk

## Allgemein

- HTML, CSS, JS
- Sämtliche Ressourcen, z.B. Bilder, Stylesheets, sind relativ zu addressieren
- Nodejs (inkl. Express) kann verwendet werden
- Nur Serverseitig dürfen Bibs verwendet werden
- SVGs dürfen zum visualisieren verwendet werden
- schnelles und intuitives Erfassen des Spiels, Anleitungen auf das Minimum reduzieren und angenehm auf dem gewählten Zielgerät spielbar sein
- Quelltext mit Augenmaß auf Mitentwickler dokumentieren (kein JSDoc). Eine sprechende Benennung der Bezeichner ist wichtiger, als eine ausführliche Quelltextdokumentation
- kurze Dokumentation für das Gitlab (README.md)
  - Spielkonzept erläutern
  - Bedienung erklären
  - Arbeitsaufteilung auf die Teammitglieder erklären.

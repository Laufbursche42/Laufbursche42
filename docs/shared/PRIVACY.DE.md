# Datenschutz

Dieses Werkzeug läuft vollständig in deinem Browser. Es hat kein eigenes Backend und keine Konten. Dieser Text erklärt genau, was mit deinen Daten passiert und was nicht.

## Kurzfassung

Das Werkzeug sammelt nichts. Es gibt keine Konten, keine Analyse, keine Telemetrie, kein Tracking, keine Werbung, keine Cookies und keine Skripte von Dritten. Nichts wird jemals an den Autor gesendet.

## Welche Daten das Werkzeug verarbeitet und wo sie bleiben

Alles Folgende bleibt auf deinem Gerät und wird nicht an dieses Projekt hochgeladen:

- Live-Scooter-Daten, die über Bluetooth gelesen werden: Telemetrie, gespeicherte Einstellungen sowie die Seriennummer und das daraus abgeleitete Modell.
- Einstellungen, die du am Scooter änderst, werden nur zwischen deinem Browser und dem Scooter geschrieben, nicht an dieses Projekt.
- Das Protokoll auf dem Bildschirm. Es bleibt in der offenen Seite, ist zusätzlich geschwärzt (keine Schlüssel, Token, Seriennummern oder rohen Geräte-IDs) und wird nur dann als `.txt` gespeichert, wenn du darauf tippst.
- Gemerkte Scooter und ein paar Einstellungen (Sprache, Design) werden nur lokal in deinem Browser gespeichert.

## Netzwerkverbindungen

Das Werkzeug stellt eine Netzwerkverbindung nur in einem Fall her:

- **Laden der Seite.** Dein Browser holt die statischen Dateien vom Hoster (siehe unten).

Scooter-Daten, Telemetrie, die Seriennummer oder geänderte Einstellungen werden in keinem Fall an dieses Projekt gesendet. Für einzelne Modelle öffnet der Firmware-Button den passenden Patcher in einem neuen Tab; das ist eine eigene Seite, die sich selbst über Bluetooth verbindet.

## Hosting und Zugriffsstatistik

Die Seite wird als statische Datei über einen Hoster ausgeliefert (GitHub Pages / Cloudflare Pages). Beim Abruf verarbeiten diese Anbieter technisch notwendige Zugriffsdaten (etwa IP-Adresse, Zeitpunkt und Browser-Kennung), um die Dateien zuzustellen. Cloudflare erstellt daraus zusammengefasste, anonyme Statistiken (etwa Herkunftsland, Gerätetyp und Browser), die der Autor einsieht, um zu sehen, wie und von wo aus das Werkzeug genutzt wird. Es werden keine persönlichen Profile gebildet und keine Konten benötigt. Details regeln die Datenschutzerklärungen von [GitHub](https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement) und [Cloudflare](https://www.cloudflare.com/privacypolicy/).

## Bluetooth zum Scooter

Eine lokale Funkverbindung zu deinem Scooter über Web Bluetooth. Das ist keine Internetverbindung, es verlassen keine Daten dein Gerät über das Netz. Das Auslesen der Telemetrie, das Ändern von Einstellungen und alle weiteren Befehle laufen nur zwischen deinem Browser und dem Scooter.

## Kein Entwickler-Backend

Nichts wird jemals an den Autor gesendet. Es gibt kein Cloud-Konto und keinen von diesem Projekt betriebenen Server, der deine Daten empfängt.

## Kontakt

Bei Fragen zum Datenschutz wende dich an den Autor (Laufbursche): [laufbursche42.github.io/Laufbursche42](https://laufbursche42.github.io/Laufbursche42/)

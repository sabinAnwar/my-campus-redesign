# E-Mail-Konfiguration für Kontaktformular

## Schritt 1: Gmail App-Passwort erstellen

1. Gehe zu https://myaccount.google.com/
2. Klicke auf "Sicherheit" (links)
3. Aktiviere "Bestätigung in zwei Schritten" (falls noch nicht aktiviert)
4. Scrolle zu "App-Passwörter"
5. Wähle "Mail" und "Windows-Computer"
6. Kopiere das generierte 16-stellige Passwort

## Schritt 2: Füge diese Zeilen zu deiner .env Datei hinzu:

```env
# E-Mail Konfiguration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sabinanwar2@gmail.com
SMTP_PASSWORD=dein-app-passwort-hier
SMTP_FROM="IU Student Portal <noreply@iu-study.org>"
```

## Schritt 3: Ersetze "dein-app-passwort-hier"

Füge das 16-stellige App-Passwort ein, das du in Schritt 1 erstellt hast.

Beispiel:
```env
SMTP_PASSWORD=abcd efgh ijkl mnop
```

## Schritt 4: Server neu starten

Nach dem Hinzufügen der Umgebungsvariablen:
1. Stoppe den Dev-Server (Ctrl+C)
2. Starte ihn neu: `npm run dev`

## Fertig! 🎉

Jetzt werden echte E-Mails versendet, wenn jemand das Kontaktformular ausfüllt:
- ✅ E-Mail an: sabinanwar2@gmail.com
- ✅ Bestätigungs-E-Mail an den Benutzer
- ✅ Speicherung in der Datenbank

## Troubleshooting

### "Invalid login" Fehler
- Stelle sicher, dass 2-Faktor-Authentifizierung aktiviert ist
- Verwende ein App-Passwort, nicht dein normales Gmail-Passwort

### "Connection timeout" Fehler
- Überprüfe, ob Port 587 nicht blockiert ist
- Versuche Port 465 mit `secure: true`

### E-Mails kommen nicht an
- Überprüfe den Spam-Ordner
- Stelle sicher, dass SMTP_USER korrekt ist
- Schaue in die Konsole für Fehlermeldungen

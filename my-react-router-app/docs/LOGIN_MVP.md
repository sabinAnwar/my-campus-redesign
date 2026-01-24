Nach dem Login können minimale Profildaten aus dem Auth0 User Profil angezeigt werden:
- `user.name`
- `user.email`
- `user.picture`

Die App nutzt den Auth0 `sub` als stabile ID, falls ihr später eine Datenbank‑Zuordnung braucht.

## Logout‑Flow (MVP)
1) User wählt Logout.
2) Die App leitet über Auth0 aus (Single Sign‑Out).
3) Redirect zurück auf die Startseite.

## Häufige Probleme
- **Callback URL mismatch**: Die exakte lokale URL muss in Auth0 erlaubt sein.
- **Initiate Login URI** verlangt HTTPS: Feld leer lassen oder https verwenden.
- **Organization required**: Org‑Pflicht deaktivieren oder Nutzer in Org aufnehmen.
- **Google‑Login erscheint**: Google‑Connection in der App deaktivieren.

## Minimaler Test
- Login mit einem erlaubten Auth0‑Benutzer.
- Weiterleitung zum Dashboard funktioniert.
- Logout leitet zurück zur Startseite.

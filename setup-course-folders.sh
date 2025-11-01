#!/bin/bash
# Hilfskript zum Organisieren von Kursmaterialien

# Dieser Befehl erstellt die Ordnerstruktur für alle Kurse:

# Webentwicklung (WEB101)
mkdir -p public/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/{skript,musterklausuren,foliensaetze,podcasts,toturium}

# Programmierung (PROG101)
mkdir -p public/uploads/studiengaenge/Wirtschaftsinformatik/Programmierung/{skript,musterklausuren,foliensaetze,podcasts,toturium}

# Datenbanken (DB101)
mkdir -p public/uploads/studiengaenge/Wirtschaftsinformatik/Datenbanken/{skript,musterklausuren,foliensaetze,podcasts,toturium}

# Angewandte Ethik (AE101)
mkdir -p public/uploads/studiengaenge/Wirtschaftsinformatik/AngewandteEthik/{skript,musterklausuren,foliensaetze,podcasts,toturium}

# Soziale Organisationen (SOP101)
mkdir -p public/uploads/studiengaenge/Wirtschaftsinformatik/SozialeOrganisationen/{skript,musterklausuren,foliensaetze,podcasts,toturium}

# Informatik Grundlagen (INFO101)
mkdir -p public/uploads/studiengaenge/Wirtschaftsinformatik/InformatikGrundlagen/{skript,musterklausuren,foliensaetze,podcasts,toturium}

# Startup & Innovation (STARTUP101)
mkdir -p public/uploads/studiengaenge/Wirtschaftsinformatik/StartupInnovation/{skript,musterklausuren,foliensaetze,podcasts,toturium}

# BWL Grundlagen (BWL101)
mkdir -p public/uploads/studiengaenge/Wirtschaftsinformatik/BWLGrundlagen/{skript,musterklausuren,foliensaetze,podcasts,toturium}

echo "✅ Ordnerstruktur erstellt!"
echo "Kopiere jetzt deine PDFs in die entsprechenden Ordner:"
echo "- Skripte → skript/"
echo "- Klausuren → musterklausuren/"
echo "- Folien → foliensaetze/"
echo "- Podcasts → podcasts/"
echo "- Tutorium → toturium/"

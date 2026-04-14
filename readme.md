Notatapplikasjon

Dette prosjektet er en enkel notatapplikasjon hvor jeg har laget både frontend og backend.

Brukeren kan:

lage notater
lage todo-lister
se det som er lagret
slette ting
Hva jeg har gjort

Jeg har laget en webside med HTML, CSS og JavaScript hvor brukeren kan skrive inn notater og todo-lister.

Jeg har brukt JavaScript til å:

håndtere klikk og skjema (forms)
legge til og fjerne oppgaver i todo-lister
lagre data i localStorage
vise data på siden
slette lagrede elementer

Jeg har også laget en backend med Python (FastAPI) som kan:

hente data fra en JSON-fil
lagre data i en JSON-fil

Data blir lagret i en fil som heter data.json.

Hvordan det fungerer

Frontend:

Har to faner: notater og todo-lister
Sender og henter data
Viser det som er lagret

Backend:

Har endepunkter for å hente og lagre data
Leser og skriver til JSON-fil
Hvordan kjøre prosjektet
Start backend

Gå til server-mappen og kjør:

python app.py

Serveren starter på port 8000.

Start frontend

Åpne:

index.html

i nettleseren.
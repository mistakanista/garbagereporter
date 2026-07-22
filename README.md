# garbagereporter
report a full or broken trashbin and manage to fix it on a list and a map view

## Prequisites
- docker

## Setup
- crete local .env File with the following content:
  POSTGRES_DB=garbagereporter
  POSTGRES_USER=barcamp
  POSTGRES_PASSWORD=barcamp
- docker compose up --build

## Endpoints:
- Frontend: localhost:8000
- add trasbin: localhost:8000/eimer
- Backend: localhost:8010

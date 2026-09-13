# garbagereporter
report a full or broken trashbin and manage to fix it on a list and a map view

## Prequisites
- docker

## Setup
- create local .env File with the following content:
  POSTGRES_DB=garbagereporter
  POSTGRES_USER=barcamp
  POSTGRES_PASSWORD=barcamp
- docker compose up --build

## Endpoints:
- Frontend: localhost:8000
- add trasbin: localhost:8000/eimer
- Backend: localhost:8010

## AI garbage detection
- there is an interface AiReportService with the method analyze which can be used to analyse images to detect if the reported problem relates to the image
- this service will be called at configurable times via a cronjob
- the profile defines the AiReportService implementation that will be used
- The defaults are
- AI_CRON=0 0 2 * * * #every second hour
- PROFILE=mock-ai # only simulates an ai service
- There is a working implementaion of the AI image analysis with AWS bedrock 
- it needs the following additional credentials in the .env file 
- AWS_REGION=<your region eg: eu-central-1>
- AWS_ACCESS_KEY_ID="<your AWS access key>"
- AWS_SECRET_ACCESS_KEY="<your AWS secret access key>"
- BEDROCK_CHAT_MODEL=<your bedrock chat model arn>

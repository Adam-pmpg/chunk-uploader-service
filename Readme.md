#NodeJS API

##Description

Potrzebuję testowo API, które przyjmie pocięty klip video
złoży go i zapisze cały

##Docker

###Uruchomienie

sudo docker-compose up -d

###Zatrzymaj i usuń kontenery

sudo docker-compose down

docker rmi <image_name_or_id>
docker rmi node18_api-video_api

sudo docker stop 

###Wejście do pracującego kontenera

sudo docker exec -it {container-name} bash

sudo docker exec -it node18_api-video_api-1 bash

###Czyszczenie obrazów
TIP:
Found orphan containers ([node18_api-node18_api-1 node18_api-video_api-1 node18_api-app-1]) for this project. If you removed or renamed this service in your compose file, you can run this command with the --remove-orphans flag to clean it up.


##Endpoints

###POST | upload klipu video
POST http://localhost:3000/upload

###DELETE | czyszczenie folderów Chunks oraz Output

DELETE http://localhost:3000/clear-chunks

###POST | scalenie poszczególnych przyczynków video, w jeden plik

POST http://localhost:3000/merge-video

###POST /merge-video-via-stream

duże pliki, np. 5,7GB nie zawieszały kompa, próbuję innego podejścia - strumienioweg
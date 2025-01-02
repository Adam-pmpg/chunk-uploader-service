# Użyteczne komendy w Dockerze

## Usuń obrazy, które są aktualnie używane w kontenerach

docker rm $(docker ps -a -q)

## Usuń wszystkie obrazy

docker rmi $(docker images -q)
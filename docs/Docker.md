# Użyteczne komendy w Dockerze

## Usuń obrazy, które są aktualnie używane w kontenerach

docker rm $(docker ps -a -q)

## Usuń wszystkie obrazy

docker rmi $(docker images -q)

## Wolumeny 

### Usuń wszystkie voluminy

docker volume rm $(docker volume ls -q)

## Usuń nieużywane wolumeny

docker volume prune
docker compose up
pnpm dev

docker exec -it <container_id> bash

su postgres
psql
\l
\c threads
\d
\d users
select \* from users;

This app has a microservice setup and all three microservices are built on node.js.
The frontend is built on React + Vite


Frontend:-
Component based Vite app built with Axios, Redux, Hash Router, Form hook and many more cool functions.
This is served on an nginx server.


Microservices:-
1.auth
This is for the user authentication during login and usage.
The API gateway handles this service most of the times. So it is completely independent from the other two services.
2.WS
The websocket service for chat, message requests and peer discovery.
3.Exchanges
This service handles the functionality of the app such as finding matches and returning them to the use based on their preferences.


NGINX:-
There is a NGINX container that works as api gateway. It takes care of the authentication and reate limiiting.


Storage:-
We got two containers (redis+postgres) that handle all the caching and storage requirements.
Postgress container stores the user info, geographic info status and preferences of the users.
Redis container stored the expired tokens and caches recent requests with TTL.


Docker:-
There is a yaml file that run all 7 containers and handle container restarts, volumes, dependencies and the docker network.


This is just an overview of the blocks we have in this app. Check out each directory to find more cool stuff and how everything works. 


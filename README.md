This app has a microservice setup and all three microservices are built on node.js.
The frontend is built on React + Vite
Everything runs on a free tier ec2 instancce and lambda.


Frontend:-
Component based Vite app built with Axios, Redux, Hash Router, Form hook, socket.io and many more cool functions.
This is served on an nginx server.
Uses SSL certificates signed by digicert to secure the site.
Uses HTTPOnly cookies to prevent client access to tokens.
Uses roter outlets to nest components and redux to store state. 
Uses session storage and useeffect to persist data on reloads.
Uses geolocation API to capture the user location.

Microservices:-
1.auth
This is for the user authentication during login and usage.
The API gateway handles this service most of the times. So it is completely independent from the other two services.
Uses aws-sdk/client-s3 to store profile pictures of registered users and create signed urls for S3.
Uses HTTPOnly cookies to securely transport the JWT tokens.
EndPoints:- Register, Login, Logout

2.WS
The websocket service for chat, message requests and peer discovery.

3.Exchanges
This service handles the functionality of the app such as finding matches and returning them to the use based on their preferences.
Uses distance.js middleware to calculate the geographic distance between potential matches (Redis will replace this in the next update).
Endpoints- needcash, needdigital


NGINX:-
There is a NGINX container that works as api gateway. It takes care of the authentication and reate limiting.


Storage:-
We got two containers (redis+postgres) that handle all the caching and storage requirements.
Postgress container stores the user info, geographic info status and preferences of the users.
Redis container stored the expired tokens and caches recent requests with TTL.


Docker:-
There is a yaml file that runs all 7 containers and handle container restarts, persistent volumes, dependencies and the docker network.



This is just an overview of the blocks we have in this app. Check out each directory and their package.json to find more cool stuff and how everything works. 




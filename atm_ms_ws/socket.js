import { WebSocketServer } from 'ws'; // Import WebSocketServer explicitly
import redisClient from './server.js';
import JWT from 'jsonwebtoken'; // Import JWT for token verification
import { parse } from 'cookie';
export function setupWebSocketServer(server) {
    const connections = {}; // To store user connections by their `myid`
    const soktotok = new Map(); // Use Map to store WebSocket associations as [token, myid]
    const wss = new WebSocketServer({ server });

    wss.on('connection',  async (ws, req) => {
        const cookies = parse(req.headers.cookie || '');
        const logintoken = cookies.token; // Get from HttpOnly cookie
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const myid = urlParams.get('myid'); // User's unique identifier
        ws.myid=myid
        try {
            await VerifyToken(logintoken); // this checks both validity and expiration via Redis
        } catch (err) {
            console.log(`Connection denied for ${myid}: ${err.message}`);
            ws.close(4001, 'Token is expired or invalid');
            return;
        }   
        // Store the [token, myid] array using the WebSocket as the key
        soktotok.set(ws, [logintoken, myid]);
        if (connections[myid]){
            console.log(`${myid} reconnected`);
            connections[myid][0]=ws;
            }
        else{
        connections[myid] = [ws, []];
        console.log(`New client connected with the id ${myid}`);}

        ws.on('message', (message) => {
            const Message = JSON.parse(message);

            // Handle various message types
            if (Message.type === 'connect') {
                try {
                    const acceptorWs = connections[Message.acceptorid][0]; // Get acceptor's WebSocket
                    acceptorWs.send(
                        JSON.stringify({
                            type: 'connectrequest',
                            initiatorid: Message.initiatorid,
                            acceptorid: Message.acceptorid,
                            conmessage: 'hey, wanna connect with me?',
                        })
                    );
                } catch (error) {
                    console.log(error);
                }
            } else if (Message.type === 'accepted') {
                try {
                    const requestfrom = Message.requestfrom;
                    const requestto = Message.requestto;

                    // Manage pairing
                    connections[requestfrom][1].push(requestto);
                    connections[requestto][1].push(requestfrom);

                    // Notify initiator
                    connections[requestfrom][0].send(
                        JSON.stringify({
                            type: 'acceptedbythematch',
                            acceptedbyid: requestto,
                            conmessage: `your request has been accepted by ${Message.requestto}`,
                        })
                    );
                } catch (error) {
                    console.log(error);
                }
            } else {
                try {
                    const msgfrom = Message.msgfrom.toString();
                    const msg = Message.msg;
                    const msgto = Message.msgto;

                    // Ensure users are paired before sending a message
                    if (connections[msgfrom][1].includes(msgto)) {
                        connections[msgto][0].send(
                            JSON.stringify({
                                type: 'message',
                                msgfrom: msgfrom,
                                msg: msg,
                                msgto: msgto,
                            })
                        );
                    } else {
                        console.log('Cannot send message as users are not paired');
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        });

ws.on('close', async () => {
    console.log('Client disconnected');
    const idtocheck= ws.myid
    let elapsedSeconds = 0;
    const interval = setInterval(() => {
        // Check if conn[id] === ws
        if (connections[idtocheck][0] !== ws) {
            console.log('Condition met: conn[id] === ws. Exiting early.');
            soktotok.delete(ws);
            clearInterval(interval); // Stop the interval
            return; // Exit without calling foobar
        }
        elapsedSeconds++;
        if (elapsedSeconds >= 6) {
            console.log('Condition not met for 10 seconds. Executing logout .');
            clearInterval(interval); // Stop the interval
            handlewindowclose(ws,soktotok,connections); // Call the foobar function
        }
    }, 1000); // Check every 1 second
});

    });

    return wss;
}


const VerifyToken = async (token) => {
    if (!token) throw new Error('Missing token');

    const isExpired = await redisClient.sIsMember('expired_tokens', token);
    if (isExpired) throw new Error('Token is expired');

    return JWT.verify(token, process.env.MY_JWT_SECRET);
};

import { pool } from './server.js'; // make sure this is imported!

async function handlewindowclose(ws, soktotok, connections) {
  const data = soktotok.get(ws);
  if (!data) {
    console.error('No token or myid found for disconnected WebSocket.');
    soktotok.delete(ws);
    return;
  }

  const [token, myid] = data;

  if (!token) {
    console.error(`Missing token for ${myid}. Cannot proceed with logout.`);
    soktotok.delete(ws);
    return;
  }

  try {
    // Verify token and get user ID from payload
    const decodedToken = await VerifyToken(token);
    const curuid = decodedToken.userID;

    // Update userstats to reflect logout
    await pool.query(`
      UPDATE userstats
      SET userlat = 0,
          userlong = 0,
          status = false,
          needscash = false,
          needsdigital = false,
          tranamount = 0
      WHERE user_id = $1
    `, [curuid]);

    // Add token to Redis blacklist
    await redisClient.sAdd('expired_tokens', token);

    console.log(`User ${curuid} (username: ${myid}) logged out on WebSocket close.`);
  } catch (error) {
    console.error(`Logout error for ${myid}:`, error.message);
  }

  // Clean up memory maps
  delete connections[myid];
  soktotok.delete(ws);
}

export default setupWebSocketServer;

/*everything websocket */

/* doesnt matter who accepted, if a request is accepted bt me or my match, i have to push it.*/
import store from "../Redux/store";
import { addRequest, removeRequest} from "../Redux/reqslice";
import { addChat } from "../Redux/chatsslice";
import { addMessage } from "../Redux/messageslice";
/* when user logs in, we connect the web socket*/
let socket = null;
let heartbeatInterval=null
export const connectWebSocket = (myid) => {
  socket = new WebSocket(`wss://chicken-fish.site/socket/?myid=${myid}`);
  socket.onopen = () => {
    console.log('WebSocket connection established for:', myid);
    heartbeatInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ping' }));
        // console.log('Heartbeat ping sent');
      }
    }, 10000);
  };
   
 socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case 'connectrequest':
        console.log(`New request from ${data.initiatorid}`);
        store.dispatch(addRequest(data.initiatorid)); // Add request to state
        break; 

      case 'acceptedbythematch':
        console.log(data.conmessage);
        console.log(data.acceptedbyid)
        store.dispatch(addChat(data.acceptedbyid)); 
        break;

      case 'message': {
        const { msgfrom, msg} = data;

      // Dispatch the message to the appropriate key (chatWith user)
        store.dispatch(
          addMessage({
          key: msgfrom, // Key is the sender (msgfrom)
          msg: msg, // The actual message content
          received: true, // This message was received, not sent
        })
      );

      console.log(`Message received from ${msgfrom}: ${msg}`);
      break;
    }

      default:
        console.log('Message from server:', data);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
    }    
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return socket;
};
/*this function just gives that websocket instance when it gets called. just import and call if you need the obj*/ 

export const getWebSocket = () => socket; // To access the socket instance elsewhere

/* for sending the chat request, called in the matches component */
export const sendConnectRequest = (pairId) => {
  if (!socket) {
    console.error('WebSocket is not connected.');
    return;
  }

  const payload = {
    type: 'connect',
    initiatorid:localStorage.getItem('usernameforreact'),
    acceptorid: pairId,
  };

  socket.send(JSON.stringify(payload));
  console.log(`Connection request sent to: ${pairId}`);
};


/* to accept the chat request from the requests component  */
export const acceptConnectRequest = (requestfrom, requestto) => {
  if (!socket) {
    console.error('WebSocket is not connected.');
    return;
  }
  store.dispatch(addChat(requestfrom))
  store.dispatch(removeRequest(requestfrom))
  const payload = {
    type: 'accepted',
    requestfrom: requestfrom,
    requestto: requestto,
  };

  socket.send(JSON.stringify(payload));
  console.log(`Connection accepted between ${requestfrom} and ${requestto}`);
};


/*send a message to the matched guy. call this in the chat window to send a message*/
export const sendMessageToMatch = (msgfrom, msgto, msg) => {
  if (!socket) {
    console.error('WebSocket is not connected.');
    return;
  }

  const payload = {
    type: 'message', // Indicates a message type
    msgfrom: msgfrom,
    msgto: msgto,
    msg: msg,
  };

  socket.send(JSON.stringify(payload));
    store.dispatch(
    addMessage({
    key: msgto, // Key is the sender (msgfrom)
    msg: msg, // The actual message content
    received: false, // This message was received, not sent
  })
);
  console.log(`Message sent from ${msgfrom} to ${msgto}`)
};





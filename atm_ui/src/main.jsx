import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import HomePage from './Components/home.jsx';
import Register from './Components/Register.jsx';
import UserDashboard from './Components/dashboard.jsx';
import Chats from './Components/chats.jsx';
import Matches from './Components/matches.jsx';
import NotFound from './Components/notfound.jsx';
import ChatWindow from './Components/chatwindow.jsx';
import Requests from './Components/requests.jsx';
import { Provider } from 'react-redux'; // Import Redux Provider
import store from './Redux/store.jsx';
import { HashRouter, Routes, Route } from 'react-router-dom'; // Use HashRouter instead of BrowserRouter
import { Content } from './Components/content.jsx';
import TandC from './Components/t & c.jsx';
import { connectWebSocket } from './RealTime/socket.jsx'; // Import WebSocket utility
import Readme from './Components/readme.jsx';
// WebSocket reconnection logic
window.onload = () => {
    const username = localStorage.getItem('usernameforreact');
    
    if (username) {
        console.log('Attempting WebSocket reconnection...');
        connectWebSocket(username); // Call the function with stored values
    } else {
        console.log('User credentials not found in localStorage. Cannot reconnect WebSocket.');
    }
};

// React Router configuration with HashRouter
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/readme" element={<Readme/>}/>
                    <Route path="/register" element={<Register />} />
                    <Route path="/terms" element={<TandC />} />
                    <Route path="/userdashboard" element={<UserDashboard />}>
                        <Route path="content" element={<Content />} />
                        <Route path="chats" element={<Chats />} />
                        <Route path="matches/:cash" element={<Matches />} />
                        <Route path="chatwindow/:nameofmatch" element={<ChatWindow />} />
                        <Route path="requests" element={<Requests />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </HashRouter>
        </Provider>
    </StrictMode>
);

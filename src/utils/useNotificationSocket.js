import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {toast} from "react-toastify";

export let stompClient = null;

export function useNotificationSocket() {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
            console.log('Connected to WebSocket');
            stompClient.subscribe('/topic/noti-album', (message) => {
                const notification = JSON.parse(message.body);
                console.log("Album Notification Received: ", notification);
                toast.info(`🎵 ${notification.content}`, { autoClose: 5000 });
            });
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Details: ' + frame.body);
        }
    });

    stompClient.activate();
}


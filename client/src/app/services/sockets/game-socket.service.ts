import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root',
})
export class GameSocketService {
    constructor(private socket: Socket) {}

    // Метод для подключения к серверу
    connectToServer() {
        this.socket.connect();
    }

    // Метод для отправки запроса на получение списка игр
    getGames() {
        this.socket.emit('getGames');
    }

    // Метод для прослушивания списка игр от сервера
    onGamesList() {
        return this.socket.fromEvent('gamesList');
    }

    // Метод для создания новой игры
    createGame(gameType: string) {
        this.socket.emit('createGame', { type: gameType });
    }

    // Метод для присоединения к игре
    joinGame(gameId: string) {
        this.socket.emit('joinGame', { gameId });
    }

    // Дополнительные методы можно добавить по необходимости

    // Метод для отключения от сервера
    disconnectFromServer() {
        this.socket.disconnect();
    }
}

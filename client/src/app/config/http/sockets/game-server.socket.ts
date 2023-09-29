import { Socket } from 'ngx-socket-io';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class GameServerSocket extends Socket {
    constructor() {
        super({
            url: environment.gameServerSocketUrl,
            options: {
                autoConnect: false,
                withCredentials: false,
                extraHeaders: {
                    'Access-Control-Allow-Origin':
                        'https://main--celadon-faun-1beac6.netlify.app/game-platform',
                },
            },
        });
    }
}

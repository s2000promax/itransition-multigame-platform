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
                withCredentials: true,
                extraHeaders: {
                    'Access-Control-Allow-Origin':
                        'https://itransition-mgame-server.vercel.app',
                },
            },
        });
    }
}

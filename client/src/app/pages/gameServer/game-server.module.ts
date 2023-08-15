import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameServerComponent } from './component/game-server.component';
import { GameServerSocket } from '@config/http/sockets/game-server.socket';
import { SocketIoModule } from 'ngx-socket-io';
import { GameServerRoutingModule } from '@pages/gameServer/game-server-routing.module';

@NgModule({
    declarations: [GameServerComponent],
    imports: [CommonModule, GameServerRoutingModule, SocketIoModule],
    providers: [GameServerSocket],
    exports: [GameServerComponent],
})
export class GameServerModule {}

export interface JoinSessionDto {
    sessionId: string;
    player: {
        id: string;
        username: string;
    };
}

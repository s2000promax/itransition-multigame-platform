import { DocumentBuilder } from '@nestjs/swagger';

export default () =>
    new DocumentBuilder()
        .setTitle('itransition-chat')
        .setDescription('The itransition-chat API description')
        .setVersion('0.1.0')
        .build();

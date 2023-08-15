import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateMessageDto, GetMessagesDto } from './dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Message } from '@prisma/client';

@ApiTags()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post('message')
    @ApiBody({ type: CreateMessageDto })
    createMessage(
        @Body() createMessageDto: CreateMessageDto,
    ): Promise<Message> {
        return this.appService.createMessage(createMessageDto);
    }

    @Post('messages')
    getMessages(@Body() getMessagesDto: GetMessagesDto): Promise<Message[]> {
        return this.appService.getMessages(
            getMessagesDto.tags?.length ? getMessagesDto.tags : undefined,
        );
    }

    @Get('tags')
    getAllTags(): Promise<string[]> {
        return this.appService.getAllTags();
    }
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @ApiProperty({
        required: true,
        type: String,
        description: 'Message string',
    })
    content: string;
}

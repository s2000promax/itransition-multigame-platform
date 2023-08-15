import { ApiProperty } from '@nestjs/swagger';

export class GetMessagesDto {
    @ApiProperty({
        required: false,
        type: String,
        isArray: true,
        description: 'An optional array of tags',
    })
    tags?: string[];
}

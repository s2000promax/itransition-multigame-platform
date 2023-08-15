import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateMessageDto } from './dto';
import { Message, MessageTag, Tag } from '@prisma/client';

@Injectable()
export class AppService {
    constructor(private readonly prisma: PrismaService) {}

    async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
        const { content } = createMessageDto;

        const tagNames: string[] = this.extractTags(content);

        const tagsToAttach: Tag[] = await Promise.all(
            tagNames.map(async (name): Promise<Tag> => {
                const existingTag: Tag = await this.prisma.tag.findUnique({
                    where: { name },
                });
                if (existingTag) {
                    return existingTag;
                }

                return this.prisma.tag.create({ data: { name } });
            }),
        );

        const message: Message = await this.prisma.message.create({
            data: { content },
        });

        await Promise.all(
            tagsToAttach.map((tag: Tag) =>
                this.prisma.messageTag.create({
                    data: {
                        messageId: message.id,
                        tagId: tag.id,
                    },
                }),
            ),
        );

        return message;
    }

    async getMessages(tags?: string[]): Promise<Message[]> {
        if (tags && tags.length > 0) {
            return this.prisma.message.findMany({
                where: {
                    OR: [
                        {
                            tags: {
                                some: {
                                    tag: {
                                        name: {
                                            in: tags,
                                        },
                                    },
                                },
                            },
                        },
                        {
                            tags: {
                                none: {},
                            },
                        },
                    ],
                },
                include: {
                    tags: true,
                },
            });
        }

        return this.prisma.message.findMany({
            include: {
                tags: true,
            },
        });
    }

    async getAllTags(): Promise<string[]> {
        const tags = await this.prisma.tag.findMany({
            select: {
                name: true,
            },
        });

        return tags.map((tag) => tag.name);
    }

    private extractTags(content: string): string[] {
        const regex: RegExp = /#\w+/g;
        return content.match(regex) || [];
    }
}

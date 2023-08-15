-- CreateTable
CREATE TABLE "messages" (
    "message_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "tags" (
    "tag_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "message_tag" (
    "messageId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "message_tag_pkey" PRIMARY KEY ("messageId","tagId")
);

-- AddForeignKey
ALTER TABLE "message_tag" ADD CONSTRAINT "message_tag_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("message_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_tag" ADD CONSTRAINT "message_tag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("tag_id") ON DELETE RESTRICT ON UPDATE CASCADE;

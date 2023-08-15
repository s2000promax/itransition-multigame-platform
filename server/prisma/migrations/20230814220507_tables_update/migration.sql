/*
  Warnings:

  - You are about to drop the `MessageTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessageTag" DROP CONSTRAINT "MessageTag_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessageTag" DROP CONSTRAINT "MessageTag_tagId_fkey";

-- DropTable
DROP TABLE "MessageTag";

-- DropTable
DROP TABLE "Tag";

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

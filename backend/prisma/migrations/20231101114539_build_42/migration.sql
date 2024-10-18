-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PRIVATE', 'PASSWORD');

-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('CLASSIC', 'SPEED');

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "img" TEXT NOT NULL DEFAULT './img/default.jpg',
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "twoAuthOn" BOOLEAN NOT NULL DEFAULT false,
    "twoAuthSecret" TEXT,
    "apiToken" TEXT,
    "maxAge" INTEGER NOT NULL DEFAULT 0,
    "connectedChat" BOOLEAN NOT NULL DEFAULT false,
    "friendList" UUID[],
    "blockList" UUID[],

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "senderID" UUID NOT NULL,
    "receiverID" UUID,
    "channelID" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "img" TEXT NOT NULL DEFAULT '/home/qbornet/42/ft_transcendence/backend/img/default.jpg',
    "chanName" TEXT NOT NULL,
    "type" "ChannelType" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT,
    "creatorID" UUID NOT NULL,
    "admins" UUID[],
    "bans" UUID[],
    "mute" UUID[],

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mode" "MatchType" NOT NULL DEFAULT 'CLASSIC',
    "idPlayerWin" UUID NOT NULL,
    "winnerScore" INTEGER NOT NULL DEFAULT 0,
    "idPlayerLoose" UUID NOT NULL,
    "looserScore" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChannelToUsers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_chanName_key" ON "Channel"("chanName");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelToUsers_AB_unique" ON "_ChannelToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelToUsers_B_index" ON "_ChannelToUsers"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelID_fkey" FOREIGN KEY ("channelID") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_idPlayerWin_fkey" FOREIGN KEY ("idPlayerWin") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_idPlayerLoose_fkey" FOREIGN KEY ("idPlayerLoose") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUsers" ADD CONSTRAINT "_ChannelToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToUsers" ADD CONSTRAINT "_ChannelToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

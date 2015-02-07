CREATE TABLE [dbo].[Participant_Item]
(
	--[Id] INT NOT NULL PRIMARY KEY
	[ParticipantId] uniqueidentifier not null
	, [ItemId] uniqueidentifier not null
	--, [CreatedDate] DATETIME NOT NULL default(getutcdate())
    , CONSTRAINT [FK_Participant] FOREIGN KEY ([ParticipantId]) REFERENCES [Participant]([Id])
	, CONSTRAINT [FK_Item] FOREIGN KEY ([ItemId]) REFERENCES [Item]([Id])
	, constraint [PK_Participant_Item] PRIMARY KEY ([ParticipantId],[ItemId])
)

﻿CREATE TABLE [dbo].[Item]
(
	[Id] uniqueidentifier NOT NULL PRIMARY KEY default(newid())
	, [EventId] uniqueidentifier not null
	, [ParticipantId] uniqueidentifier not null
	, [Name] nvarchar(max) not null
	, [Description] nvarchar(max) null
	, [Price] decimal(12,2) not null
	, [CreatedDate] DATETIME NOT NULL default(getutcdate())
	, [LastModified] DATETIME NOT NULL default(getutcdate())
	, constraint [FK_Event_Item] foreign key ([EventId]) references [Event]([Id]) on delete cascade
	, constraint [FK_Item_PurchasedBy] foreign key ([ParticipantId]) references [Participant]([Id])
)

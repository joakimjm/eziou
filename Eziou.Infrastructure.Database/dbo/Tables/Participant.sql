CREATE TABLE [dbo].[Participant]
(
	[Id] BIGINT NOT NULL PRIMARY KEY IDENTITY
	, [Name] nvarchar(max) not null
	, [EventId] uniqueidentifier not null
	, [CreatedDate] DATETIME NOT NULL default(getutcdate())
	, [LastModified] DATETIME NOT NULL default(getutcdate())
	, constraint [FK_Event_Participant] foreign key ([EventId]) references [Event]([Id]) on delete cascade
)

CREATE TABLE [dbo].[Event]
(
	[Id] uniqueidentifier NOT NULL PRIMARY KEY default(newid())
    , [Name] NVARCHAR(MAX) NOT NULL
	, [ExpirationDate] datetime not null
	, [CreatedDate] DATETIME NOT NULL default(getutcdate())
	, [LastModified] DATETIME NOT NULL default(getutcdate())
)

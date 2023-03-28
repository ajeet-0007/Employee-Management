CREATE DATABASE [organizationdb]
GO
USE [organizationdb]
GO
/****** Object:  Table [dbo].[userAttendances]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userAttendances](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[checkInTime] [time](7) NULL,
	[checkOutTime] [time](7) NULL,
	[checkInDate] [date] NULL,
	[checkOutDate] [date] NULL,
	[location] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[userProfiles]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userProfiles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[permanentAddress] [nvarchar](255) NULL,
	[city] [nvarchar](255) NULL,
	[state] [nvarchar](255) NULL,
	[country] [nvarchar](255) NULL,
	[emergencyPhone] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[userProjectLists]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userProjectLists](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[projectId] [int] NULL,
	[projectName] [nvarchar](255) NULL,
	[date] [date] NULL,
	[department] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[userRequests]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userRequests](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[startDate] [date] NULL,
	[endDate] [date] NULL,
	[request] [nvarchar](255) NULL,
	[status] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[hrmid] [nvarchar](255) NULL,
	[name] [nvarchar](255) NULL,
	[email] [nvarchar](255) NULL,
	[password] [nvarchar](255) NULL,
	[phone] [nvarchar](255) NULL,
	[image] [nvarchar](255) NULL,
	[role] [nvarchar](255) NULL,
	[reportingManager] [nvarchar](255) NULL,
	[allocation] [nvarchar](255) NULL,
	[joiningDate] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[userSkills]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userSkills](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[primarySkills] [nvarchar](255) NULL,
	[secondarySkills] [nvarchar](255) NULL,
	[certifications] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[userTimesheets]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userTimesheets](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[clientName] [nvarchar](255) NULL,
	[projectName] [nvarchar](255) NULL,
	[jobName] [nvarchar](255) NULL,
	[workItem] [nvarchar](255) NULL,
	[date] [date] NULL,
	[description] [nvarchar](255) NULL,
	[startTime] [time](7) NULL,
	[endTime] [time](7) NULL,
	[billableStatus] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[userRequests] ADD  DEFAULT (N'Pending') FOR [status]
GO
/****** Object:  StoredProcedure [dbo].[spusers_getcurrentuser]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_getcurrentuser]
	@email nvarchar(255)
AS
BEGIN
	SELECT * from dbo.users where email = @email
	SET NOCOUNT ON;
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_getuser]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_getuser]
	@userId int 
AS 
BEGIN
	SELECT * from  dbo.users 
	where id = @userId
	SET NOCOUNT ON;
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_getuserattendance]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_getuserattendance]
	@userId int 
AS 
BEGIN
	SELECT * from  dbo.users LEFT JOIN dbo.userAttendances ON dbo.userAttendances.userId = dbo.users.id
	where userId = @userId
	SET NOCOUNT ON;
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_getuserprofile]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_getuserprofile]
	@userId int 
AS 
BEGIN
	SELECT * from  dbo.userProfiles INNER JOIN dbo.users ON dbo.userProfiles.userId = dbo.users.id
	where userId = @userId
	SET NOCOUNT ON;
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_getuserrequests]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_getuserrequests]
	@userId int 
AS 
BEGIN
	SELECT * from  dbo.users LEFT JOIN dbo.userRequests ON dbo.userRequests.userId = dbo.users.id
	where userId = @userId
	SET NOCOUNT ON;
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_getuserskills]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_getuserskills]
	@userId int 
AS 
BEGIN
	SELECT * from  dbo.users LEFT JOIN dbo.userSkills ON dbo.userSkills.userId = dbo.users.id
	where userId = @userId
	SET NOCOUNT ON;
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_getusertimesheet]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_getusertimesheet]
	@userId int 
AS 
BEGIN
	SELECT * from  dbo.users LEFT JOIN dbo.userTimesheets ON dbo.userTimesheets.userId = dbo.users.id
	where userId = @userId
	SET NOCOUNT ON;
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_postcheckin]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_postcheckin]
	@userId int, @checkInTime time(7), @checkInDate date, @location nvarchar(255)
AS 
BEGIN
	INSERT INTO dbo.userAttendances (userId, checkInTime, checkInDate, location)
	values (@userId, @checkInTime, @checkInDate, @location)
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_postsignup]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_postsignup]
	@hrmid nvarchar(255), @name nvarchar(255), @email nvarchar(255),@password nvarchar(255), @phone nvarchar(255), @image nvarchar(255), @role nvarchar(255),  @reportingManager nvarchar(255), @allocation nvarchar(255), @joiningDate nvarchar(255)
AS 
BEGIN
	INSERT INTO dbo.users (hrmid,name, email, password, phone, image, role, reportingManager, allocation, joiningDate)
	values (@hrmid,@name,@email,@password, @phone, @image, @role, @reportingManager, @allocation, @joiningDate)
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_postuserprofile]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_postuserprofile]
	@userId int, @permanentAddress nvarchar(255), @city nvarchar(255), @state nvarchar(255),@country nvarchar(255), @emergencyPhone nvarchar(255)
AS 
BEGIN
	INSERT INTO dbo.userProfiles (userId,permanentAddress , city, state, country, emergencyPhone)
	values (@userId, @permanentAddress ,  @city ,  @state,@country,  @emergencyPhone)
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_postuserrequest]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_postuserrequest]
	@userId int, @startDate date, @endDate date,@request nvarchar(255)
AS 
BEGIN
	INSERT INTO dbo.userRequests(userId,startDate, endDate, request)
	values (@userId,@startDate,@endDate,@request )
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_postuserskills]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_postuserskills]
	@userId int, @primarySkills nvarchar(255), @secondarySkills nvarchar(255),@certifications nvarchar(255)
AS 
BEGIN
	INSERT INTO dbo.userSkills(userId, primarySkills, secondarySkills, certifications)
	values (@userId,@primarySkills,@secondarySkills,@certifications )
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_postusertimesheet]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_postusertimesheet]
	@userId int, @clientName nvarchar(255), @projectName nvarchar(255), @jobName nvarchar(255), @workItem nvarchar(255), @date date, @description nvarchar(255), @startTime time(7), @endTime time(7), @billableStatus nvarchar(255)
AS 
BEGIN
	INSERT INTO dbo.userTimesheets(userId, clientName, projectName, jobName, workItem, date,description, startTime,endTime, billableStatus )
	values (@userId,@clientName,@projectName, @jobName, @workItem, @date, @description, @startTime, @endTime,@billableStatus )
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_updateuserattendance]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_updateuserattendance]
	@userId int ,@checkOutDate date,@checkOutTime time(7)
AS 
BEGIN
	UPDATE dbo.userAttendances
	SET checkOutDate=@checkOutDate, checkOutTime=@checkOutTime
	where userId = @userId AND checkInDate= @checkOutDate
	SET NOCOUNT ON;
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_updateuserprofile]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_updateuserprofile]
	@userId int ,@permanentAddress nvarchar(255),@city nvarchar(255) ,@state nvarchar(255),@country nvarchar(255), @emergencyPhone nvarchar(255)
AS 
BEGIN
	UPDATE dbo.userProfiles
	SET permanentAddress=@permanentAddress, city=@city, state=@state, country = @country,  emergencyPhone=@emergencyPhone
	where userProfiles.id = @userId
	SET NOCOUNT ON;
END
GO
/****** Object:  StoredProcedure [dbo].[spusers_updateuserskills]    Script Date: 3/28/2023 7:50:50 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spusers_updateuserskills]
	@userId int ,@primarySkills nvarchar(255),@secondarySkills nvarchar(255) ,@certifications nvarchar(255)
AS 
BEGIN
	UPDATE dbo.userSkills
	SET primarySkills=@primarySkills, secondarySkills=@secondarySkills, certifications=@certifications
	where userId = @userId
	SET NOCOUNT ON;
END
GO

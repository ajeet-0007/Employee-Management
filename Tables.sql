USE [organizationdb]
GO
/****** Object:  Table [dbo].[userAttendances]    Script Date: 4/10/2023 3:25:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userAttendances](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[checkInTime] [nvarchar](255) NULL,
	[checkOutTime] [nvarchar](255) NULL,
	[checkInDate] [date] NULL,
	[checkOutDate] [date] NULL,
	[checkInLocation] [nvarchar](255) NULL,
	[checkOutLocation] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[userProfiles]    Script Date: 4/10/2023 3:25:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userProfiles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[image] [nvarchar](255) NULL,
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
/****** Object:  Table [dbo].[userProjects]    Script Date: 4/10/2023 3:25:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userProjects](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[projectId] [int] NULL,
	[projectName] [nvarchar](255) NULL,
	[assignedOn] [date] NULL,
	[completeBy] [date] NULL,
	[teamMembers] [nvarchar](255) NULL,
	[teamHead] [nvarchar](255) NULL,
	[department] [nvarchar](255) NULL,
	[status] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[userRequests]    Script Date: 4/10/2023 3:25:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userRequests](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[email] [nvarchar](255) NULL,
	[startDate] [date] NULL,
	[endDate] [date] NULL,
	[request] [nvarchar](255) NULL,
	[reason] [nvarchar](255) NULL,
	[status] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]    Script Date: 4/10/2023 3:25:16 PM ******/
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
	[role] [nvarchar](255) NULL,
	[reportingManager] [nvarchar](255) NULL,
	[location] [nvarchar](255) NULL,
	[joiningDate] [date] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[userSkills]    Script Date: 4/10/2023 3:25:16 PM ******/
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
/****** Object:  Table [dbo].[userTimesheets]    Script Date: 4/10/2023 3:25:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userTimesheets](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[userId] [int] NULL,
	[timesheetName] [nvarchar](255) NULL,
	[clientName] [nvarchar](255) NULL,
	[projectName] [nvarchar](255) NULL,
	[jobName] [nvarchar](255) NULL,
	[workItem] [nvarchar](255) NULL,
	[date] [date] NULL,
	[week] [nvarchar](255) NULL,
	[description] [nvarchar](255) NULL,
	[startTime] [nvarchar](255) NULL,
	[endTime] [nvarchar](255) NULL,
	[billableStatus] [nvarchar](255) NULL,
	[submittedHours] [nvarchar](255) NULL,
	[approvedHours] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[userProjects] ADD  DEFAULT (N'Active') FOR [status]
GO
ALTER TABLE [dbo].[userRequests] ADD  DEFAULT (N'Pending') FOR [status]
GO
ALTER TABLE [dbo].[userTimesheets] ADD  DEFAULT (N'00:00') FOR [approvedHours]
GO

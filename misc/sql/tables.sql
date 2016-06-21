DROP TABLE IF EXISTS
  Person,
  Post,
  Community,
  Follower,
  Member,
  Content,
  Person_Content,
  Community_Content,
  Reaction,
  Comment
CASCADE;

-- Person para nao usar User
CREATE TABLE Person (
  
  ID SERIAL NOT NULL,
  Login VARCHAR(20) NOT NULL,
  Password VARCHAR(30) NOT NULL,
  Display_Name VARCHAR(30),
  Photo BYTEA,
  Description VARCHAR(128),
  Birth_Date DATE,
  
  CONSTRAINT Person_PK PRIMARY KEY (ID),
  CONSTRAINT Person_Login_SK UNIQUE (Login),
  
  CONSTRAINT Person_Login_CK CHECK (Login SIMILAR TO '\w+'),
  CONSTRAINT Person_Password_CK CHECK (length(Password) BETWEEN 6 AND 30)
  
);

CREATE TABLE Post (
  
  ID SERIAL NOT NULL,
  Title VARCHAR(16) DEFAULT '(sem t�tulo)',
  Content VARCHAR(255) NOT NULL,
  Author INTEGER NOT NULL,
  
  CONSTRAINT Post_PK PRIMARY KEY (ID),
  
  CONSTRAINT Post_Author_FK FOREIGN KEY (Author)
    REFERENCES Person (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
  
);

-- Community para nao usar Group
CREATE TABLE Community (
  
  ID SERIAL NOT NULL,
  Owner INTEGER NOT NULL,
  Name VARCHAR(16) NOT NULL,
  
  CONSTRAINT Comm_PK PRIMARY KEY (ID),
  CONSTRAINT Comm_Owner_Name_SK UNIQUE (Owner, Name),
  
  CONSTRAINT Comm_Owner_FK FOREIGN KEY (Owner)
    REFERENCES Person (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  
  CONSTRAINT Community_Name_CK CHECK (Name SIMILAR TO '\w+')
  
);

CREATE TABLE Follower (
  
  ID SERIAL NOT NULL,
  Follower INTEGER NOT NULL,
  Following INTEGER NOT NULL,
  
  CONSTRAINT Follower_PK PRIMARY KEY (ID),
  CONSTRAINT Follower_SK UNIQUE (Follower, Following),
  
  CONSTRAINT Follower_Follower_FK FOREIGN KEY (Follower)
    REFERENCES Person (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  
  CONSTRAINT Follower_Following_FK FOREIGN KEY (Following)
    REFERENCES Person (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
  
);

CREATE TABLE Member (
  
  ID SERIAL NOT NULL,
  Person INTEGER NOT NULL,
  Community INTEGER NOT NULL,
  
  CONSTRAINT Member_PK PRIMARY KEY (ID),
  CONSTRAINT Member_SK UNIQUE (Person, Community),
  
  CONSTRAINT Member_Person_FK FOREIGN KEY (Person)
    REFERENCES Person (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  
  CONSTRAINT Member_Community_FK FOREIGN KEY (Community)
    REFERENCES Community (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
  
);

CREATE TABLE Content (
  
  ID SERIAL NOT NULL,
  Post INTEGER NOT NULL,
  Posted_At TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT Content_PK PRIMARY KEY (ID),
  
  CONSTRAINT Content_Post_FK FOREIGN KEY (Post)
    REFERENCES Post (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
  
);

CREATE TABLE Person_Content (
  
  ID INTEGER NOT NULL,
  Profile INTEGER NOT NULL,
  
  CONSTRAINT Person_Content_PK PRIMARY KEY (ID),
  
  CONSTRAINT Person_Content_ID_FK FOREIGN KEY (ID)
    REFERENCES Content (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  
  CONSTRAINT Person_Content_Profile_FK FOREIGN KEY (Profile)
    REFERENCES Person (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
  
);

CREATE TABLE Community_Content (
  
  ID INTEGER NOT NULL,
  Community INTEGER NOT NULL,
  
  CONSTRAINT Community_Content_PK PRIMARY KEY (ID),
  
  CONSTRAINT Community_Content_ID_FK FOREIGN KEY (ID)
    REFERENCES Content (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  
  CONSTRAINT Community_Content_Community_FK FOREIGN KEY (Community)
    REFERENCES Community (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
  
);

CREATE TABLE Reaction (
  
  ID SERIAL NOT NULL,
  Reacting INTEGER NOT NULL,
  Content INTEGER NOT NULL,
  Rating CHAR(1) NOT NULL, 
  
  CONSTRAINT Reaction_PK PRIMARY KEY (ID),
  CONSTRAINT Reaction_SK UNIQUE (Reacting, Content),
  
  CONSTRAINT Reaction_Reacting_FK FOREIGN KEY (Reacting)
    REFERENCES Person (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  
  CONSTRAINT Reaction_Content_FK FOREIGN KEY (Content)
    REFERENCES Content (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  
  CONSTRAINT Reacting_Rating_CK CHECK (upper(Rating) IN ('L', 'U'))
  
);

CREATE TABLE Comment (
  
  ID SERIAL NOT NULL,
  Commenter INTEGER NOT NULL,
  Content INTEGER NOT NULL,
  Description VARCHAR(255) NOT NULL,
  Commented_At TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT Comment_PK PRIMARY KEY (ID),
  
  CONSTRAINT Comment_Commenter_FK FOREIGN KEY (Commenter)
    REFERENCES Person (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  
  CONSTRAINT Comment_Content_FK FOREIGN KEY (Content)
    REFERENCES Content (ID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
  
);

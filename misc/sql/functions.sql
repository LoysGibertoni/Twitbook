DROP SCHEMA IF EXISTS Person CASCADE;
CREATE SCHEMA Person;

CREATE OR REPLACE FUNCTION Person.Authenticate(login_arg IN CHAR, password_arg IN CHAR)
  RETURNS INTEGER
AS
$$
DECLARE
  
  res BOOL;
  
BEGIN
  
  SELECT password = password_arg
  INTO STRICT res
  FROM Person
  WHERE Login = login_arg;
  
  IF res THEN
    RETURN 1;
  ELSE
    RETURN 0;
  END IF;
  
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RETURN -1;
  WHEN OTHERS THEN
    RETURN -2;
  
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Person.Sign_Up(login_arg IN CHAR, password_arg IN CHAR)
  RETURNS VOID
AS
$$
BEGIN

  INSERT INTO Person (Login, Password)
  VALUES (login_arg, password_arg);
  
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Person.Has_User(login_arg IN CHAR)
  RETURNS BOOL
AS
$$
DECLARE
  res INTEGER;
  
BEGIN
  
  SELECT COUNT(*)
  INTO res
  FROM Person
  WHERE Login = login_arg;
  
  RETURN res = 1;
  
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Person.Update_Info(login_arg IN CHAR, old_password_arg IN CHAR, new_password_arg IN CHAR, display_name_arg IN CHAR, description_arg IN CHAR, birth_date_arg IN DATE)
  RETURNS BOOL
AS
$$
DECLARE
  person_id Person.ID%TYPE;
  curr_password Person.Password%TYPE;
  
BEGIN

  SELECT Person.ID
  INTO person_id
  FROM Person
  WHERE Login = login_arg;

  SELECT Password
  INTO curr_password
  FROM Person
  WHERE ID = person_id;

  IF old_password_arg IS NOT NULL AND new_password_arg IS NOT NULL AND curr_password <> old_password_arg THEN
    RAISE NOTICE 'HERE';
    RAISE EXCEPTION 'Password mismatch';
  END IF;

  UPDATE Person
  SET
    Password = coalesce(new_password_arg, curr_password),
    Display_Name = display_name_arg,
    Description = description_arg,
    Birth_Date = birth_date_arg
  WHERE ID = person_id;

  RETURN TRUE;

EXCEPTION

  WHEN OTHERS THEN
    RETURN FALSE;

END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Person.Get_Posts(login_arg IN CHAR)
  RETURNS TABLE (
	  ID Content.ID%TYPE, 
    Title Post.Title%TYPE,
    Content Post.Content%TYPE,
    Author_Login Person.Login%TYPE,
    Author_Display_Name Person.Display_Name%TYPE,
    Posted_At Content.Posted_At%TYPE,
    Likes INTEGER,
    Unlikes INTEGER,
    Repost BOOL
  )
AS
$$
DECLARE

  content_cur CURSOR(person_id_cur_arg Person.ID%TYPE) FOR
    SELECT
      C.ID AS c_id,
      P.Title AS p_title,
      P.Content AS p_content,
      A.Login AS a_login,
      A.Display_Name AS a_display_name,
      C.Posted_At AS c_posted_at 
    FROM Post P
      JOIN Person A ON P.Author = A.ID
      JOIN Content C ON C.Post = P.ID
      JOIN Person_Content PC ON PC.ID = C.ID
    WHERE PC.Profile = person_id_cur_arg
    ORDER BY C.Posted_At DESC;

  person_id Person.ID%TYPE;
  result_likes INTEGER;
  result_unlikes INTEGER;
  
BEGIN
  
  SELECT Person.ID
  INTO person_id
  FROM Person
  WHERE Login = login_arg;
  
  FOR cur_iterator IN content_cur(person_id) LOOP

    SELECT COUNT(*)
    INTO result_likes
    FROM Reaction
    WHERE Reaction.Content = cur_iterator.c_id
      AND Rating = 'L';
    
    SELECT COUNT(*)
    INTO result_unlikes
    FROM Reaction
    WHERE Reaction.Content = cur_iterator.c_id
      AND Rating = 'U';
    
    RETURN QUERY
      SELECT
        cur_iterator.c_id,
        cur_iterator.p_title,
        cur_iterator.p_content,
        cur_iterator.a_login,
        cur_iterator.a_display_name,
        cur_iterator.c_posted_at,
        result_likes,
        result_unlikes,
        Post.Oldest_Post(cur_iterator.c_id) <> cur_iterator.c_id;

  END LOOP;
  
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Person.Get_Following_Posts(person_id_arg IN INTEGER, filter IN CHAR)
  RETURNS TABLE (
	  ID Content.ID%TYPE, 
    Title Post.Title%TYPE,
    Content Post.Content%TYPE,
    Author_Login Person.Login%TYPE,
    Author_Display_Name Person.Display_Name%TYPE,
    Posted_At Content.Posted_At%TYPE,
    Likes INTEGER,
    Unlikes INTEGER
  )
AS
$$
DECLARE

  content_cur CURSOR(person_id_cur_arg Person.ID%TYPE) FOR
    SELECT
      C.ID AS c_id,
      P.Title AS p_title,
      P.Content AS p_content,
      A.Login AS a_login,
      A.Display_Name AS a_display_name,
      C.Posted_At AS c_posted_at 
    FROM Post P
      JOIN Person A ON P.Author = A.ID
      JOIN Content C ON C.Post = P.ID
      JOIN Person_Content PC ON PC.ID = C.ID
    WHERE upper(P.Content) LIKE upper('%' || filter || '%')
      AND PC.Profile IN (
        SELECT Following
        FROM Follower
        WHERE Follower = person_id_cur_arg
      )
    ORDER BY C.Posted_At DESC;
  
  result_likes INTEGER;
  result_unlikes INTEGER;
  
BEGIN
  
  FOR cur_iterator IN content_cur(person_id_arg) LOOP

    SELECT COUNT(*)
    INTO result_likes
    FROM Reaction
    WHERE Reaction.Content = cur_iterator.c_id
      AND Rating = 'L';
    
    SELECT COUNT(*)
    INTO result_unlikes
    FROM Reaction
    WHERE Reaction.Content = cur_iterator.c_id
      AND Rating = 'U';
    
    RETURN QUERY
      SELECT
        cur_iterator.c_id,
        cur_iterator.p_title,
        cur_iterator.p_content,
        cur_iterator.a_login,
        cur_iterator.a_display_name,
        cur_iterator.c_posted_at,
        result_likes,
        result_unlikes;


  END LOOP;
  
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Person.Get_Follow_Numbers(login_arg IN CHAR)
  RETURNS TABLE (
    followers INTEGER,
    following INTEGER
  )
AS
$$
DECLARE
  person_id Person.ID%TYPE;
  n_followers INTEGER;
  n_following INTEGER;

BEGIN
  
  SELECT ID
  INTO person_id
  FROM Person
  WHERE Login = login_arg;
  
  SELECT COUNT(*)
  INTO n_followers
  FROM Follower
  WHERE Follower.following = person_id;
  
  SELECT COUNT(*)
  INTO n_following
  FROM Follower
  WHERE Follower.follower = person_id;
  
  RETURN QUERY
    SELECT n_followers, n_following;
  
END;
  
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Person.Is_Following(follower_id_arg IN INTEGER, following_id_arg IN INTEGER)
  RETURNS BOOL
AS
$$
DECLARE
  res INTEGER;
  
BEGIN
  
  SELECT COUNT(*)
  INTO res
  FROM Follower
  WHERE Follower = follower_id_arg
    AND Following = following_id_arg;
  
  RETURN res = 1;
  
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Person.Get_Groups(person_id_arg IN INTEGER)
  RETURNS TABLE (
    id Community.ID%TYPE,
    name Community.Name%TYPE,
    owner Person.Login%TYPE
  )
AS
$$
BEGIN
  
  RETURN QUERY
    SELECT
      C.ID,
      C.Name,
      P.Login 
    FROM Member M
      JOIN Community C ON C.ID = M.Community
      JOIN Person P ON P.ID = C.Owner
    WHERE M.Person = person_id_arg;
  
END;
  
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Person.Get_Search_Results(filter IN CHAR)
  RETURNS TABLE (
	  ID Person.ID%TYPE, 
    Login Person.Login%TYPE,
    Display_Name Person.Display_Name%TYPE
  )
AS
$$
BEGIN
  
  RETURN QUERY
    SELECT
      P.ID,
      P.Login,
      P.Display_Name
    FROM Person P
    WHERE (P.Display_Name IS NOT NULL AND upper(P.Display_Name) LIKE upper('%' || filter || '%'))
      OR upper(P.Login) LIKE upper('%' || filter || '%')
    ORDER BY P.Login ASC;
  
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Person.Get_Not_Member_Search_Results(group_id_arg IN INTEGER, filter IN CHAR)
  RETURNS TABLE (
	  ID Person.ID%TYPE, 
    Login Person.Login%TYPE,
    Display_Name Person.Display_Name%TYPE
  )
AS
$$
BEGIN
  
  RETURN QUERY
    SELECT
      P.ID,
      P.Login,
      P.Display_Name
    FROM Person P
    WHERE ((P.Display_Name IS NOT NULL AND upper(P.Display_Name) LIKE upper('%' || filter || '%'))
      OR upper(P.Login) LIKE upper('%' || filter || '%'))
      AND P.ID NOT IN (
        SELECT Person
        FROM Member
        WHERE Community = group_id_arg
      )
    ORDER BY P.Login ASC;
  
END;
$$
LANGUAGE plpgsql;


DROP SCHEMA IF EXISTS Post CASCADE;
CREATE SCHEMA Post;

CREATE OR REPLACE FUNCTION Post.Oldest_Post(content_id_arg IN INTEGER)
  RETURNS INTEGER
AS
$$
DECLARE
  post_id Post.ID%TYPE;
  oldest_content_id Content.ID%TYPE;

BEGIN

  SELECT Post
  INTO post_id
  FROM Content
  WHERE ID = content_id_arg;

  SELECT ID
  INTO oldest_content_id
  FROM Content
  WHERE Post = post_id
    AND Posted_At <= ALL (
      SELECT Posted_At
      FROM Content
      WHERE Post = post_id
    );

  RETURN oldest_content_id;

END;

$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Post.Person_New_Post(person_id_arg IN INTEGER, title_arg IN CHAR, content_arg IN CHAR)
  RETURNS VOID
AS
$$
DECLARE
  post_id Post.ID%TYPE;
  content_id Content.ID%TYPE;
  
BEGIN
  
  SELECT nextval('post_id_seq')
  INTO post_id;
  
  INSERT INTO Post (ID, Title, Content, Author)
  VALUES (post_id, title_arg, content_arg, person_id_arg);
  
  SELECT nextval('content_id_seq')
  INTO content_id;
  
  INSERT INTO Content (ID, Post)
  VALUES (content_id, post_id);
  
  INSERT INTO Person_Content (ID, profile)
  VALUES (content_id, person_id_arg);

END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Post.Group_New_Post(group_id_arg IN INTEGER, person_id_arg IN INTEGER, title_arg IN CHAR, content_arg IN CHAR)
  RETURNS INTEGER
AS
$$
DECLARE
  post_id Post.ID%TYPE;
  content_id Content.ID%TYPE;
  
BEGIN
  
  SELECT nextval('post_id_seq')
  INTO post_id;
  
  INSERT INTO Post (ID, Title, Content, Author)
  VALUES (post_id, title_arg, content_arg, person_id_arg);
  
  SELECT nextval('content_id_seq')
  INTO content_id;
  
  INSERT INTO Content (ID, Post)
  VALUES (content_id, post_id);
  
  INSERT INTO Community_Content (ID, Community)
  VALUES (content_id, group_id_arg);
  
  RETURN content_id;

END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Post.Person_Repost(person_id_arg IN INTEGER, content_id_arg IN INTEGER)
  RETURNS INTEGER
AS
$$
DECLARE
  content_id Content.ID%TYPE;
  post_id Post.ID%TYPE;
  
BEGIN
  
  SELECT nextval('content_id_seq')
  INTO content_id;
  
  SELECT Post
  INTO post_id
  FROM Content
  WHERE ID = content_id_arg;

  INSERT INTO Content (ID, Post)
  VALUES (content_id, post_id);
  
  INSERT INTO Person_Content (ID, profile)
  VALUES (content_id, person_id_arg);

  RETURN content_id;
  
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Post.Group_Repost(group_id_arg IN INTEGER, content_id_arg IN INTEGER)
  RETURNS INTEGER
AS
$$
DECLARE
  content_id Content.ID%TYPE;
  post_id Post.ID%TYPE;
  
BEGIN
  
  SELECT nextval('content_id_seq')
  INTO content_id;
  
  SELECT Post
  INTO post_id
  FROM Content
  WHERE ID = content_id_arg;

  INSERT INTO Content (ID, Post)
  VALUES (content_id, post_id);
  
  INSERT INTO Community_Content (ID, Community)
  VALUES (content_id, group_id_arg);

  RETURN content_id;
  
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Post.Person_Delete(content_id_arg INTEGER)
  RETURNS VOID
AS
$$
DECLARE
  oldest_content_id Content.ID%TYPE;

BEGIN

  oldest_content_id := Post.Oldest_Post(content_id_arg);
  
  IF content_id_arg = oldest_content_id THEN
    
    DELETE FROM Post
    WHERE ID = (
      SELECT Post
      FROM Content
      WHERE ID = content_id_arg
    );
  
  ELSE

    DELETE FROM Content
    WHERE ID = content_id_arg;

  END IF;

END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Post.Person_Update(content_id_arg INTEGER, new_title CHAR DEFAULT NULL, new_content CHAR DEFAULT NULL)
  RETURNS VOID
AS
$$
DECLARE
  post_id Post.ID%TYPE;
  update_title Post.Title%TYPE;
  update_content Post.Content%TYPE;

BEGIN

  SELECT Post
  INTO post_id
  FROM Content
  WHERE ID = content_id_arg;

  SELECT coalesce(new_title, Post.Title), coalesce(new_content, Post.Content)
  INTO update_title, update_content
  FROM Post
  WHERE ID = post_id;

  UPDATE Post
  SET
    title = update_title,
    content = update_content
  WHERE ID = post_id;

END;
$$
LANGUAGE plpgsql;

DROP SCHEMA IF EXISTS Reaction CASCADE;
CREATE SCHEMA Reaction;

CREATE OR REPLACE FUNCTION Reaction.Toggle_Like(person_id_arg IN INTEGER, content_id_arg IN INTEGER)
  RETURNS INTEGER
AS
$$
DECLARE
  reaction_rating Reaction.Rating%TYPE;

BEGIN

  SELECT Rating
    INTO reaction_rating
    FROM Reaction
    WHERE Reacting = person_id_arg 
      AND Content = content_id_arg;

  IF reaction_rating = 'L' THEN
    
    DELETE FROM Reaction
    WHERE Reacting = person_id_arg 
      AND Content = content_id_arg;
    
    RETURN -1;

  ELSIF reaction_rating = 'U' THEN

    UPDATE Reaction
    SET
      Rating = 'L'
    WHERE Reacting = person_id_arg
      AND Content = content_id_arg;
    
    RETURN 1;

  ELSE

    INSERT INTO Reaction (Reacting, Content, Rating)
    VALUES (person_id_arg, content_id_arg, 'L');

    RETURN 0;

  END IF;

END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Reaction.Toggle_Unlike(person_id_arg IN INTEGER, content_id_arg IN INTEGER)
  RETURNS INTEGER
AS
$$
DECLARE
  reaction_rating Reaction.Rating%TYPE;

BEGIN

  SELECT Rating
    INTO reaction_rating
    FROM Reaction
    WHERE Reacting = person_id_arg 
      AND Content = content_id_arg;

  IF reaction_rating = 'U' THEN
    
    DELETE FROM Reaction
    WHERE Reacting = person_id_arg 
      AND Content = content_id_arg;
    
    RETURN -1;

  ELSIF reaction_rating = 'L' THEN

    UPDATE Reaction
    SET
      Rating = 'U'
    WHERE Reacting = person_id_arg
      AND Content = content_id_arg;
    
    RETURN 1;

  ELSE

    INSERT INTO Reaction (Reacting, Content, Rating)
    VALUES (person_id_arg, content_id_arg, 'U');
    
    RETURN 0;

  END IF;

END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Reaction.New_Comment(person_id_arg IN INTEGER, content_id_arg IN INTEGER, description_arg IN CHAR)
  RETURNS VOID
AS
$$
BEGIN

  INSERT INTO Comment (Commenter, Content, Description)
  VALUES (person_id_arg, content_id_arg, description_arg);

END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Reaction.Get_Comments(content_id_arg IN INTEGER)
  RETURNS TABLE (
    Author_Display_Name Person.Display_Name%TYPE,
    Author_Login Person.Login%TYPE,
    Description Comment.Description%TYPE,
    Commented_At Comment.Commented_At%TYPE
  )
AS
$$
BEGIN

  RETURN QUERY
    SELECT
      P.Display_Name,
      P.Login,
      C.Description,
      C.Commented_At
    FROM Comment C
      JOIN Person P ON C.Commenter = P.ID
    WHERE Content = content_id_arg
    ORDER BY C.Commented_At DESC;

END;
$$
LANGUAGE plpgsql;


DROP SCHEMA IF EXISTS Community CASCADE;
CREATE SCHEMA Community;

CREATE OR REPLACE FUNCTION Community.Get_Posts(group_arg IN INTEGER)
  RETURNS TABLE (
	  ID Content.ID%TYPE, 
    Title Post.Title%TYPE,
    Content Post.Content%TYPE,
    Author_Login Person.Login%TYPE,
    Author_Display_Name Person.Display_Name%TYPE,
    Author_ID Post.Author%TYPE,
    Posted_At Content.Posted_At%TYPE,
    Likes INTEGER,
    Unlikes INTEGER,
    Repost BOOL
  )
AS
$$
DECLARE

  content_cur CURSOR(group_id_cur_arg Community.ID%TYPE) FOR
    SELECT
      C.ID AS c_id,
      P.Title AS p_title,
      P.Content AS p_content,
      A.Login AS a_login,
      A.Display_Name AS a_display_name,
      P.Author AS p_author,
      C.Posted_At AS c_posted_at 
    FROM Post P
      JOIN Person A ON P.Author = A.ID
      JOIN Content C ON C.Post = P.ID
      JOIN Community_Content CC ON CC.ID = C.ID
    WHERE CC.Community = group_id_cur_arg
    ORDER BY C.Posted_At DESC;

  result_likes INTEGER;
  result_unlikes INTEGER;
  
BEGIN
  
  FOR cur_iterator IN content_cur(group_arg) LOOP

    SELECT COUNT(*)
    INTO result_likes
    FROM Reaction
    WHERE Reaction.Content = cur_iterator.c_id
      AND Rating = 'L';
    
    SELECT COUNT(*)
    INTO result_unlikes
    FROM Reaction
    WHERE Reaction.Content = cur_iterator.c_id
      AND Rating = 'U';
    
    RETURN QUERY
      SELECT
        cur_iterator.c_id,
        cur_iterator.p_title,
        cur_iterator.p_content,
        cur_iterator.a_login,
        cur_iterator.a_display_name,
        cur_iterator.p_author,
        cur_iterator.c_posted_at,
        result_likes,
        result_unlikes,
        Post.Oldest_Post(cur_iterator.c_id) <> cur_iterator.c_id;

  END LOOP;
  
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Community.New_Community(person_id_arg IN INTEGER, name_arg IN CHAR)
  RETURNS VOID
AS
$$
DECLARE
  community_id Community.ID%TYPE;
  member_id Member.ID%TYPE;
  
BEGIN
  
  SELECT nextval('community_id_seq')
  INTO community_id;
  
  INSERT INTO Community (ID, Owner, Name)
  VALUES (community_id, person_id_arg, name_arg);

  SELECT nextval('member_id_seq')
  INTO member_id;

  INSERT INTO Member (ID, Person, Community)
  VALUES (member_id, person_id_arg, community_id);

END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION Community.Get_Search_Results(person_id_arg IN INTEGER, filter IN CHAR)
  RETURNS TABLE (
	  ID Community.ID%TYPE, 
    Owner Person.Login%TYPE,
    Name Community.Name%TYPE
  )
AS
$$
BEGIN
  
  RETURN QUERY
    SELECT
      C.ID,
      P.Login,
      C.Name
    FROM Member M
      JOIN Community C ON C.ID = M.Community
      JOIN Person P ON P.ID = C.Owner
    WHERE upper(C.Name) LIKE upper('%' || filter || '%')
      AND M.Person = person_id_arg
    ORDER BY C.Name ASC;
  
END;
$$
LANGUAGE plpgsql;
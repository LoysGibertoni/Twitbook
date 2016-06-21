@ECHO OFF
SETLOCAL
  
  CMD /C CHCP 1252 1>nul 2>&1
  IF %ERRORLEVEL% NEQ 0 (
    ECHO Postgresql failure! 1>&2
    ECHO Could not change code page. 1>&2
    PAUSE
    EXIT /B %ERRORLEVEL%
  )
  
  "C:\Program Files\PostgreSQL\9.5\bin\psql.exe" -h localhost -U postgres -d twitbook -p 5432
  IF %ERRORLEVEL% NEQ 0 (
    ECHO Postgresql failure! 1>&2
    ECHO Could not change code page. 1>&2
    PAUSE
    EXIT /B %ERRORLEVEL%
  )
  
  EXIT /B 
  
ENDLOCAL

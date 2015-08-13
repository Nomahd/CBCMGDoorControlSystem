@ECHO OFF
cd C:\Program Files\DoorControl
del /Q DoorControlLog.log
start javaw -DPROFILE=DoorControlProfile.ini -jar DoorControl.jar
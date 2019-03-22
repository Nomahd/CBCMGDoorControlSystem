# Open Sesame Church Remote Door System
This project was created at my first software internship back in 2014. It utilizes a WIMP stack hosted on a local machine running Windows and IIS. The system and mobile application allows regular users to unlock the front doors of the building if connected to the building WiFi, or an admin to unlock the door anywhere with an Internet connection. Usage data is tracked and the users and privileges are sourced from the building personnel directory. 

## Overview
This README will describe each component of the Door Control System. They comprise of the following:  
AutoIt Scripts  
CBCMG Door Mobile Application  
Desktop Tray Utility  
SQL Query  
Web Server  

## AutoIt Scripts
The scripts are used to perform window and mouse commands on the door security application program running on the host machine. 

## SQL Script
In Microsoft SQL Server 2012 (or similar), open the SQL script and execute to create the necessary database and tables.

## Web Server
Place the WebApplication folder (inside the Web Server folder) in a location of your choosing (suggest C:\inetpub\www) and 
create a website on IIS that points to that folder. Modify the config.xml file to change the <folder> and <status> tags to a location that
is on your computer. Make sure that location has permission to write.

## Desktop Tray Utility
To run the Desktop Tray Utility, run the .bat file and a door icon will appear in the tray in the bottom right hand corner.
Config the DoorControlProfile.ini with the correct paths.
-REQFOLDER should point to the same location as the <folder> tag you made in config.xml.
-LOGFOLDER can point to any folder (preferably the same parent folder as REQFOLDER).
-LOGFILE should point to DoorControl root directory.
-PNGFILE should point to ...DoorControl\images\doorclose.png
-UPFILE should point to ...DoorControl\images\dooropen.png
-DOWNFILE should point to ...DoorControl\images\doorclose.png
-MENUCOMMANDx should point to the respective AutoIt script as named in the corresponding MENUITEMx.
-STATUSFILE path should be the same path as the <status> tag and ending with \Status.log.

## CBCMG Door Mobile Application
The app should be opened as an existing android project in Android Development Tools and downloaded onto your phone through with the run command.
the app can also be run on your browser with SenchaCMD. The command "sencha web start" should be run in the command prompt while in the root 
directory of the app (...\CBCMGDoor) and the address localhost:1841 should be entered into the browser. 


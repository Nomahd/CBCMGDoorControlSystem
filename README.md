# Open Sesame Church Remote Door System
This project was created at my first software internship back in 2014. It utilizes a WIMP stack hosted on a local machine running Windows and IIS. The system and mobile application allows regular users to unlock the front doors of the building if connected to the building WiFi, or an admin to unlock the door anywhere with an Internet connection. Usage data is tracked and the users and privileges are sourced from the building personnel directory. 

## Overview
This README will describe each component of the Door Control System. They comprise of the following:


**AutoIt Scripts  
CBCMG Door Mobile Application  
Desktop Tray Utility  
SQL Query  
Web Server**

## AutoIt Scripts
The scripts are used to perform window and mouse commands on the door security application program running on the host machine. 

## Web Server
This web server is REST API written in C# on ASP.NET. The mobile application is the main caller of this API and performs actions such as granting door access, getting langauge resources, and reading the database. 

## Desktop Tray Utility
This utility allows the host machine to watch directories for files being written by the web server, which will then execute the appropriate AutoIT script based on the given command.

## Remote Door Mobile Application
This is a HTML5 web app created with Sencha Touch and deployed through PhoneGap to Android and iOS. The mobile app has login and buttons that unlock the building door based on user privileges. 


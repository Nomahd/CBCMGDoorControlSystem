While Not ProcessExists("Access It! Lite.NET.exe")
		Run("C:\Program Files\RS2 Technologies\Access It! Lite.NET\Access It! Lite.NET.exe")
		WinActivate("Access It! Lite.NET")
		WinWaitActive("Access It! Lite.NET")

		Send("admin{ENTER}")
		WEnd
WinActivate("Access It! Lite.NET")
WinWaitActive("Access It! Lite.NET")
MouseMove (512, 384)
Send("{ALT}{RIGHT}")
For $i = 1 To 9
	Send("{DOWN}")
Next
Send("{ENTER}{UP}")
MouseClick("right", 512, 384)
For $j = 1 To 5
	Send("{Down}")
Next
Send("{ENTER}")
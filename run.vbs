Set objShell = WScript.CreateObject("WScript.Shell")


' Run npx electron .
objShell.Run "cmd /c npx electron .", 0, False

' Close the script
WScript.Quit

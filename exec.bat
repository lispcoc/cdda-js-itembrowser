dir /B /S ..\data\json\*.json > list.txt
dir /B /S ..\data\core\*.json >> list.txt
dir /B /S ..\data\legacy\*.json >> list.txt
lua53.exe autogen.lua
pause

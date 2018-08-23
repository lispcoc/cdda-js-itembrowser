mkdir rsc > NUL 2>&1
dir /B /S ..\data\json\*.json > rsc\list.txt
dir /B /S ..\data\core\*.json >> rsc\list.txt
dir /B /S ..\data\legacy\*.json >> rsc\list.txt
dir /B /S ..\data\mods\*.json > rsc\list_mod.txt
lua53.exe autogen.lua
pause

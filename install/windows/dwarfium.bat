@echo off
REM Launch Dwarfium application
start "" "%~dp0\Dwarfium.exe"

REM Launch the mediamtx application
start /Min "Dwarfium Video Server" "%~dp0\mediamtx.exe"

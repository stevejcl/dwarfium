import importlib.util
import subprocess
import os
import sys

package_name = "flask"

if importlib.util.find_spec(package_name) is None:
    print(f"{package_name} is not installed. Installing now...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", package_name])

from flask import Flask, request, jsonify, send_from_directory
# Create a Flask app, serving static files from the current directory
app = Flask(__name__, static_folder=os.getcwd())

# Serve static files (index.html + other assets)
@app.route('/')
@app.route('/<path:path>')
def serve_static(path="index.html"):
    return send_from_directory(app.static_folder, path)

# API endpoint to execute a program with parameters
@app.route('/run-exe', methods=['GET'])
def run_exe():
    try:
        # Get parameters from the request (or set defaults)
        ble_psd =  request.args.get('ble_psd', "DWARF_12345678")
        ble_STA_ssid =  request.args.get('ble_STA_ssid', '')
        ble_STA_pwd =  request.args.get('ble_STA_pwd', '')

        # Define the base name of the executable (without extension)
        extern_path = os.path.abspath(os.path.join(".","extern"))
        exe_name = "connect_bluetooth"

        # Determine the correct file extension
        if sys.platform == "win32":
            exe_path = os.path.join(extern_path, exe_name + ".exe")
        else:
            exe_path = os.path.join(extern_path, exe_name)  # No .exe on Linux/macOS

        # Ensure correct execution format for Linux/macOS
        if sys.platform != "win32":
            exe_path = "./" + exe_path.replace("\\", "/")  # Convert Windows-style paths if needed
        # Run the executable with parameters
        process = subprocess.run([exe_path, "--psd", ble_psd, "--ssid", ble_STA_ssid, "--pwd", ble_STA_pwd], cwd=extern_path,capture_output=True, text=True)

        # Debugging: Check process output
        print("Process Output:", process.stdout)
        print("Process Errors:", process.stderr)

        if process.returncode != 0:
            return {"error": f"Process failed: {process.stderr}"}

        # Read DWARF_IP from config.py
        config_path = os.path.join(extern_path, "config.py")

        if not os.path.isfile(config_path):
            return {"error": "config.py not found"}

        spec = importlib.util.spec_from_file_location("config", config_path)
        config = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(config)

        # Extract DWARF_IP
        dwarfIp = getattr(config, "DWARF_IP", "")
        dwarfId = getattr(config, "DWARF_ID", "")

        return {"dwarfIp": dwarfIp, "dwarfId": dwarfId}

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Start the Flask server on port 8000
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
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

# API endpoint to check if running
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "Proxy is running"}), 200

# API endpoint to check if a program is here
@app.route('/run-exe-health', methods=['GET'])
def run_exe_health():
    # Define the base name of the executable (without extension)
    extern_path = os.path.abspath(os.path.join(".", "extern"))
    exe_name = "connect_bluetooth"

    # Determine the correct file extension
    if sys.platform == "win32":
        exe_path = os.path.join(extern_path, exe_name + ".exe")
    else:
        exe_path = os.path.join(extern_path, exe_name)  # No .exe on Linux/macOS

    # Check if both the directory and the executable file exist
    if os.path.exists(extern_path) and os.path.exists(exe_path):
        return jsonify({"status": "Executable found"}), 200

    return jsonify({"error": "Executable not found"}), 404

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

# API endpoint to check if a program is here
@app.route('/stellarium-config-health', methods=['GET'])
def stellarium_config_health():
    # Define the base name of the executable
    extern_path = os.path.abspath(".")
    exe_name = "stellarium_auto_config"
    exe_full_name = exe_name + ".exe" if sys.platform == "win32" else exe_name

    exe_path = os.path.join(extern_path, exe_full_name)

    # Check if the executable file exist
    if os.path.exists(exe_path):
        urlExe = "/stellarium-config-exe"
        return jsonify({"status": "Executable found", "data": urlExe}), 200

    return jsonify({"error": "Executable not found"}), 404

# API endpoint to execute a program with parameters
@app.route('/stellarium-config-exe', methods=['GET'])
def stellarium_config_exe():
    try:

        # Define the base name of the executable
        install_path = os.path.abspath(".")
        exe_name = "stellarium_auto_config"
        exe_full_name = exe_name + ".exe" if sys.platform == "win32" else exe_name

        exe_path = os.path.join(install_path, exe_full_name)


        # Ensure correct execution format for Linux/macOS
        if sys.platform != "win32":
            exe_path = "./" + exe_path.replace("\\", "/")  # Convert Windows-style paths if needed

        process = subprocess.Popen(
            [exe_path], 
            cwd=install_path,
            shell=(sys.platform != "win32"),  # Use shell only on non-Windows platforms
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True  # Ensures the output is treated as text instead of bytes
        )

        stdout_data, stderr_data = process.communicate()

        if process.returncode == 0:
            print("Process exited successfully:", stdout_data)
            return jsonify({"message": "Process completed", "output": stdout_data}), 200
        else:
            print("Process exited with error:", stderr_data)
            return jsonify({"error": "Process failed", "details": stderr_data}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve static files and redirect unknown routes to index.html (for frontend routing
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_static(path):
    #  If the requested path is an API route, return 404 instead of redirecting
    if path == "health" or path == "run-exe-health" or path == "run-exe" or path =="stellarium-config-heathl" or path =="stellarium-config-exe":
        return jsonify({"error": "Not Found"}), 404

    full_path = os.path.join(app.static_folder, path)

    # If the path is a directory, serve the index.html inside it
    if os.path.isdir(full_path):
        return send_from_directory(full_path, "index.html")

    # If the file exists, serve it normally
    if os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)

    # Otherwise, redirect to index.html for frontend routing (SPA)
    return send_from_directory(app.static_folder, "index.html")

# Start the Flask server on port 8000
if __name__ == '__main__':
    # Path to your certificate and key files
    cert_file = 'DwarfiumCert.pem'
    key_file = 'DwarfiumKey.pem'

    # Check if certificates exist and run accordingly
    if os.path.exists(cert_file) and os.path.exists(key_file):
        print("Starting Dwarfium HTTPS server on port 8000")
        app.run(host='0.0.0.0', port=8000, ssl_context=(cert_file, key_file))
    else:
        print("Starting Dwarfium HTTP server on port 8000")
        app.run(host='0.0.0.0', port=8000)
import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

class CalculationHandler(BaseHTTPRequestHandler):
    
    # --- 1. NEW: Serve the HTML interface ---
    def do_GET(self):
        # When the browser asks for the root URL, serve the dashboard
        if self.path == '/' or self.path == '/dashboard.html':
            try:
                # Dynamically locate dashboard.html in the same folder as this script
                current_dir = os.path.dirname(os.path.abspath(__file__))
                file_path = os.path.join(current_dir, 'dashboard.html')
                
                with open(file_path, 'rb') as file:
                    html_content = file.read()
                
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                self.wfile.write(html_content)
                
            except FileNotFoundError:
                self.send_response(404)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(b"Error: dashboard.html not found in the same directory.")
        else:
            self.send_response(404)
            self.end_headers()

    # --- 2. Handle CORS preflight checks ---
    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    # --- 3. Handle calculation data streams ---
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            payload = json.loads(post_data.decode('utf-8'))
            
            # Extract dynamic arrays
            debts = payload.get('debts', [])
            investments = payload.get('investments', [])
            
            # The background calculations are handled in the frontend for now,
            # but this endpoint remains open to receive data if backend math is required later.
            response_data = {"status": "success", "message": "Data received."}

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
            
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = {"status": "error", "message": str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))

# --- Server Execution Block ---
if __name__ == '__main__':
    server_address = ('127.0.0.1', 5000)
    httpd = HTTPServer(server_address, CalculationHandler)
    print("Local web server running natively.")
    print("Open your browser and navigate to: http://127.0.0.1:5000")
    print("Press Ctrl+C in this terminal to stop the server.")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
        print("\nServer stopped cleanly.")
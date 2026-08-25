import json
import os
import urllib.parse
from http.server import SimpleHTTPRequestHandler, HTTPServer

DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'user_data.json')

class CalculationHandler(SimpleHTTPRequestHandler):
    
    def do_GET(self):
        if self.path == '/api/data':
            if os.path.exists(DATA_FILE):
                try:
                    with open(DATA_FILE, 'r') as f:
                        data = f.read()
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(data.encode('utf-8'))
                except Exception as e:
                    self.send_error(500, f"Error reading data: {e}")
            else:
                self.send_response(404)
                self.end_headers()
        else:
            # Serve index.html as default root
            if self.path == '/':
                self.path = '/index.html'
            super().do_GET()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/data':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                
                # Parse to ensure it's valid JSON
                payload = json.loads(post_data.decode('utf-8'))
                
                with open(DATA_FILE, 'w') as f:
                    json.dump(payload, f, indent=4)
                
                response_data = {"status": "success"}
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
        else:
            self.send_error(404, "Not Found")

if __name__ == '__main__':
    # Ensure working directory is the script directory so SimpleHTTPRequestHandler serves static files from here
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    server_address = ('127.0.0.1', 5000)
    httpd = HTTPServer(server_address, CalculationHandler)
    print("Local web server running natively.")
    print("Serving static files and API at http://127.0.0.1:5000")
    print("Press Ctrl+C to stop.")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
        print("\nServer stopped cleanly.")
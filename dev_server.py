import json
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from api.roast import call_claude

PORT = 8000


class DevHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/roast':
            self._handle_roast()
        else:
            self.send_error(404)

    def _handle_roast(self):
        try:
            length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(length))
            image_base64 = body.get('image_base64', '').strip()
            brutality_level = max(1, min(5, int(body.get('brutality_level', 3))))

            if not image_base64:
                self._send_json(400, {'error': 'Missing image_base64'})
                return

            result = call_claude(image_base64, brutality_level)
            self._send_json(200, result)

        except json.JSONDecodeError:
            self._send_json(400, {'error': 'Invalid JSON body'})
        except KeyError:
            self._send_json(500, {'error': 'ANTHROPIC_API_KEY not configured'})
        except Exception as e:
            self._send_json(500, {'error': str(e)})

    def _send_json(self, status, data):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} - {fmt % args}")


if __name__ == '__main__':
    server = HTTPServer(('', PORT), DevHandler)
    print(f"Dev server: http://localhost:{PORT}")
    print("Ctrl+C to stop.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')

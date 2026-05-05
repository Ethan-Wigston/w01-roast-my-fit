import json
import os
from http.server import BaseHTTPRequestHandler
import anthropic


def _load_prompt(brutality_level: int) -> str:
    prompt_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "prompts", "core.txt"
    )
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read().replace("{{BRUTALITY_LEVEL}}", str(brutality_level))


def _extract_image(image_base64: str) -> tuple[str, str]:
    """Handle both raw base64 and data URLs (data:image/jpeg;base64,...)."""
    if image_base64.startswith("data:"):
        header, data = image_base64.split(",", 1)
        media_type = header.split(";")[0].split(":")[1]
        return data, media_type
    return image_base64, "image/jpeg"


def _parse_response(text: str) -> dict:
    roast = ""
    feedback = ""
    if "👔 REAL TALK" in text:
        parts = text.split("👔 REAL TALK")
        roast = parts[0].replace("🔥 THE ROAST", "").strip()
        feedback = parts[1].strip()
    elif "🔥 THE ROAST" in text:
        roast = text.replace("🔥 THE ROAST", "").strip()
    else:
        roast = text.strip()
    return {"roast": roast, "feedback": feedback}


def call_claude(image_base64: str, brutality_level: int) -> dict:
    client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    system_prompt = _load_prompt(brutality_level)
    data, media_type = _extract_image(image_base64)

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        temperature=0.9,
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": data,
                        },
                    },
                    {"type": "text", "text": "Roast this outfit."},
                ],
            }
        ],
    )

    return _parse_response(message.content[0].text)


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length == 0:
                self._error(400, "No request body")
                return

            body = json.loads(self.rfile.read(content_length))
            image_base64 = body.get("image_base64", "").strip()
            brutality_level = int(body.get("brutality_level", 3))

            if not image_base64:
                self._error(400, "Missing image_base64")
                return

            brutality_level = max(1, min(5, brutality_level))
            result = call_claude(image_base64, brutality_level)
            self._send(200, result)

        except json.JSONDecodeError:
            self._error(400, "Invalid JSON body")
        except KeyError:
            self._error(500, "ANTHROPIC_API_KEY not configured")
        except Exception as e:
            self._error(500, str(e))

    def do_OPTIONS(self):
        self._send(200, {})

    def _send(self, status: int, data: dict):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.end_headers()
        self.wfile.write(body)

    def _error(self, status: int, message: str):
        self._send(status, {"error": message})

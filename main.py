import base64
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from api.roast import call_claude


def main():
    image_path = sys.argv[1] if len(sys.argv) > 1 else "test_outfit.jpg"
    brutality_level = int(sys.argv[2]) if len(sys.argv) > 2 else 3

    if not os.path.exists(image_path):
        print(f"Error: image not found at '{image_path}'")
        print("Usage: python main.py <image_path> [brutality_level 1-5]")
        sys.exit(1)

    with open(image_path, "rb") as f:
        image_base64 = base64.b64encode(f.read()).decode("utf-8")

    print(f"Roasting at brutality level {brutality_level}...\n")
    result = call_claude(image_base64, brutality_level)

    print("🔥 THE ROAST")
    print(result["roast"])
    print()
    print("👔 REAL TALK")
    print(result["feedback"])


if __name__ == "__main__":
    main()

# CLAUDE.md — Week 1: Roast My Fit

## What this is
Usable by anyone, this program takes a picture of your outfit, outputs a roast of the outfit based on the brutality slider input, and constructive and useful feedback on the outfit.

## Stack
- Frontend: [Vanilla JS + HTML/CSS | N/A]
- Backend: [None | Python + uv]
- Styling: [Tailwind CDN | plain CSS]
- Deploy: Vercel  ·  Claude: Anthropic API via fetch() / Python SDK

## Constraints
- No paid external APIs  ·  Free APIs I'm using: Claude API
- No build step (Phases 1–2)  ·  Core logic before CSS
- User upload must be an image of an adult, where at least their waist up is visible. Non-human images and those lacking proper outfit information will not be roasted

## Done looks like
- User uploads picture of outfit, sets brutality slider as desired.
- When roast button is pressed, roast is generated and outputted based on users outfit and scale choice, alongside contructive fashion advice for the user.
- User can upload another picture or choose a different scale value and get roasted again without restarting the program.
- No crashes, user cannot interupt loading, UI return to initial state after roast or error

## What's working  (update daily)
- Roast feature at all levels of bruatlity
- Slider
- Image upload (from files, taking picture(iPhone), drag and drop)
- Error Handling (wrong file type, not enough/proper info in image, connection loss)
- PC and mobile UIs
- Locking feature for elements during roast loading

## What I'm working on / what's broken
- README.md

## Edge Cases: 
- File too large -> code compresses image to reduce API use
- No internet -> Error code
- Switching images during loading -> Image upload restricted during loading
- Incorrect file type -> Error explanation toast, no upload
- Different image layout -> Image window changes shape to accommodate for image layout
- Same input (image + brutality level) -> Unique roasts each time (more randomness)
- Non-human image -> Claude catches this + explanation of error on frontend
- Outfit visibility too low -> Claude catches this + error explanation on frontend
- Image is of child -> Claude catches this + error explaining it won't roast children
  
## The prompt that worked 
Before roasting, evaluate the photo.

1. Is there at least one visible human in the photo? If NO: write ONLY a short, casual, friendly explanation that you need a photo of a person wearing an outfit. No headers, no roast, no feedback — just the explanation sentence.

2. Is at least one person's outfit visible from the waist up? If NO: write ONLY a short, casual, friendly explanation that you need to see more of the outfit. No headers, no roast, no feedback — just the explanation sentence.

If both checks pass, use the format below.

You are a fashion roast comedian with the soul of Gordon Ramsay and the
eye of a Vogue editor. You will receive a photo of one or more people's outfits.

You have two jobs:

1. ROAST — Roast the outfit(s). If there are multiple people, roast the group's collective style or each person's look. Be funny, creative, and specific to what
   you actually see. Reference specific items, colors, fits, and
   combinations. Match your brutality to the level:
   - Level 1: Gentle teasing, like a kind friend
   - Level 2: Light sarcasm, playful jabs
   - Level 3: Full roast mode, Gordon in the kitchen
   - Level 4: No mercy, Hell's Kitchen energy
   - Level 5: Scorched earth. Absolutely unhinged.
   Keep the roast under 70 words.

2. REAL TALK — Drop the act. Give genuine, specific, actionable fashion
   advice. What works, what doesn't, one concrete suggestion to level
   it up. If multiple people, address the group or each person briefly. Keep it under 100 words.

BRUTALITY LEVEL: {{BRUTALITY_LEVEL}}

VARIETY — every roast must take a completely different angle. Vary your approach — sometimes focus on colors, sometimes on fit, sometimes on the overall vibe, sometimes on a specific item, sometimes on what the outfit says about the person's personality. Never open with the same phrase twice. Mix up your sentence structure.

WRITING STYLE — follow these rules for both sections:
- Never use em-dashes.
- Write like you're texting a friend. Short, punchy sentences. Casual language. Use contractions.
- Punctuation: periods and commas only. No semicolons, no em-dashes, no colons.
- Throw in occasional slang to keep it lively, but don't repeat the same slang words.

Format your response EXACTLY like this:
🔥 THE ROAST
[your roast here]

👔 REAL TALK
[your genuine feedback here]

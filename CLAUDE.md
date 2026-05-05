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

## Done looks like
- User uploads picture of outfit, sets brutality slider as desired.
- When roast button is pressed, roast is generated and outputted based on users outfit and scale choice, alongside contructive fashion advice for the user.
- User can upload another picture or choose a different scale value and get roasted again without restarting the program.

## What's working  (update daily)
- Upload and roast features are working
- Slider
- Image upload

## What I'm working on / what's broken
- Bug where a second image can be uploaded while the first the program runs for the first one, showing the roast for the first while the second image is the one on screen.
- README.md
- Slider pictures
- Upload block sizing
- Internet connection loss doesn't show error code

## The prompt that worked  (paste here when you find it)
[Paste once Claude starts producing good output]

## What I'd do differently  (Friday only)
[One honest thing — add this before your final commit]


<img width="1917" height="1030" alt="image" src="https://github.com/user-attachments/assets/187a57f3-1e35-422b-a64a-04137e936f1c" />


## Vercel Link:
https://w01-roast-my-fit.vercel.app/ 

## Claude Prompt:

Before roasting, evaluate the photo.

Is there at least one visible human in the photo? If NO: write ONLY a short, casual, friendly explanation that you need a photo of a person wearing an outfit. No headers, no roast, no feedback — just the explanation sentence.

Is at least one person's outfit visible from the waist up? If NO: write ONLY a short, casual, friendly explanation that you need to see more of the outfit. No headers, no roast, no feedback — just the explanation sentence.

If both checks pass, use the format below.

You are a fashion roast comedian with the soul of Gordon Ramsay and the eye of a Vogue editor. You will receive a photo of one or more people's outfits.

You have two jobs:

ROAST — Roast the outfit(s). If there are multiple people, roast the group's collective style or each person's look. Be funny, creative, and specific to what you actually see. Reference specific items, colors, fits, and combinations. Match your brutality to the level:

Level 1: Gentle teasing, like a kind friend
Level 2: Light sarcasm, playful jabs
Level 3: Full roast mode, Gordon in the kitchen
Level 4: No mercy, Hell's Kitchen energy
Level 5: Scorched earth. Absolutely unhinged. Keep the roast under 70 words.
REAL TALK — Drop the act. Give genuine, specific, actionable fashion advice. What works, what doesn't, one concrete suggestion to level it up. If multiple people, address the group or each person briefly. Keep it under 100 words.

BRUTALITY LEVEL: {{BRUTALITY_LEVEL}}

VARIETY — every roast must take a completely different angle. Vary your approach — sometimes focus on colors, sometimes on fit, sometimes on the overall vibe, sometimes on a specific item, sometimes on what the outfit says about the person's personality. Never open with the same phrase twice. Mix up your sentence structure.

WRITING STYLE — follow these rules for both sections:

Never use em-dashes.
Write like you're texting a friend. Short, punchy sentences. Casual language. Use contractions.
Punctuation: periods and commas only. No semicolons, no em-dashes, no colons.
Throw in occasional slang to keep it lively, but don't repeat the same slang words.
Format your response EXACTLY like this: 🔥 THE ROAST [your roast here]

👔 REAL TALK [your genuine feedback here]

*Note: This prompt started the development of the Roast My Fit Project. There have been significant changes to the project from this initial prompt* 

## What I'd do differently:
The first thing I would've done differently is having a better idea of what done looks like before I started coding. I ended up making a lot of changes later on in development that could've been there from the start had I had a better idea of what I wanted the final product to look like. This is especially true for the UI. I ended up spending more time that I would'be like putting the different elements where I wanted them to be, rather than just figuring that out from the start.

The second thing I would've done differently is creating a better initial prompt for the project. Like I mentioned before the UI wasn't great at the start, part of which was due to lack of planning, but also my prompt wasn't detailed enough. This was a reoccuring issue, and had I been more specific will each element initially I could've saved time (ex: add a slider with 5 levels of brutality underneath the image upload box -> Add a slider with rounded corners beneath the image upload box with the following labels spaced out evenly from one end to the other: [labels]. The slider should have the same length as the image upload box and have a 5-colour gradient (green->yellow->orange->lightRed->red) going from left to right that is revealed as the slider is moved. Centered beneath the slider have the respective images from the "Slider Images" folder being displayed (level1.png -> level5.png) as the user moves the slider.) Another change I would've made to my initial prompt is to have Claude Code understand that all the files in the project folder would eventually be used in a Vercel deployment and to development the code so that there would be no issues that arise during the project deployment. 

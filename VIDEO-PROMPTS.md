# Car Deluxe: Hero Video Prompts

**Source image:** `images/hero/hero-banner.jpg`
**What we're doing:** Feed this image into an image-to-video AI tool to create a ~5-8 second looping video for the hero background.

---

## Prompt Option A: Subtle Cinematic (Recommended)

**Duration:** 5-8 seconds
**Input:** hero-banner.jpg (the existing Mercedes-AMG GT image)

```
Slow, cinematic camera movement. The camera very slowly pushes forward toward the car. Headlight LED strips pulse with a subtle glow. Reflections on the wet garage floor shimmer and ripple gently. A faint lens flare drifts across the chrome grille. The warm backlight on the left side breathes softly brighter and dimmer. Everything else stays perfectly still. Moody, dark, premium automotive atmosphere. Very slow, elegant motion. No fast movements.
```

**Settings:** Cinematic, slow motion, high quality, 24fps
**Why this works:** Subtle is luxury. A tiny amount of motion makes it feel alive without being distracting. The text overlay stays readable.

---

## Prompt Option B: Lights-On Reveal (More Dramatic)

**Duration:** 5-8 seconds
**Input:** hero-banner.jpg

```
The scene starts slightly darker than the image. Over 3 seconds, the car headlights intensify and glow brighter, casting sharper reflections on the wet concrete floor. The overhead garage fluorescent lights flicker on one by one from back to front. Chrome details on the grille and Mercedes star catch the light and sparkle. Reflections on the hood shift as the lighting changes. Slow, dramatic automotive reveal. Dark luxury mood.
```

**Settings:** Cinematic, dramatic lighting, high quality, 24fps
**Why this works:** More dramatic, feels like a car commercial reveal. But harder for AI to execute well because it requires lighting changes that stay consistent with the original image.

---

## Prompt Option C: Breathing Atmosphere (Easiest for AI)

**Duration:** 5-8 seconds
**Input:** hero-banner.jpg

```
Very subtle atmospheric motion. Faint dust particles float through the garage air, catching the light. The reflections on the wet floor gently shimmer. A barely perceptible camera drift moves very slowly to the right. The warm light on the left side of the garage softly pulses. The car remains perfectly still and sharp. Cinematic, moody, dark premium atmosphere.
```

**Settings:** Cinematic, atmospheric, high quality, 24fps
**Why this works:** Easiest for AI because the car itself stays static. Only the atmosphere moves. Very reliable results.

---

## Tips for Best Results

1. **Try Option A first.** It's the best balance of impact and AI reliability.
2. **If results are too jittery:** Switch to Option C (atmosphere only, car stays still).
3. **If results are too subtle:** Try Option B (but expect 2-3 generations to get a good one).
4. **Loop point:** The video needs to loop seamlessly. If the tool doesn't auto-loop, try generating a longer clip (8-10s) and we'll trim to a clean loop point.
5. **Resolution:** Generate at the highest resolution available. 1920x1080 (16:9) minimum. 4K if your tool supports it.
6. **Format:** MP4 is perfect. I'll handle the web optimization (compression, format conversion).
7. **File size target:** Under 10MB for the final web version (I'll compress it). Your raw output can be bigger.

## After You Generate

1. Save the best video to the Inbox folder
2. Tell me "video ready"
3. I'll optimize it (compress, convert to web formats, ensure loop is clean) and implement it on the site

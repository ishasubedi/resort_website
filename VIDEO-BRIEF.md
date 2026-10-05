# Using the resort's real video

1. Put your best real clip (8 seconds or longer, landscape, steady, no people close up) next to this file.
2. Run `./make-loop.sh your-video.mp4`. It makes `assets/video/hero.mp4` and `hero.webm`.
3. Done. When the video plays, it replaces the photo background on every page and still moves with your scroll.

Tips: shoot or pick footage with slow movement (drone push-in, mist, flags). Avoid fast pans and shaky clips.
Keep each file under about 4 MB (lower the crf quality number in the script if needed).
If you only have photos, do nothing: the site already uses them.

## If you want AI-generated footage instead
Start frame: `assets/images/gallery-1.jpg`. Prompt: slow, steady drone push-in over a pine-covered Himalayan valley, soft golden light, thin mist between the pines, gentle branch sway, warm steady wall lights, prayer flags fluttering. Keep the red-roofed A-frame cottages and the stone-and-timber lodge exactly as in the photo. Negative: people, faces, text, logos, shake, flicker, extra or distorted buildings. Reject any take where the buildings change shape.

#!/bin/sh
# Usage: ./make-loop.sh your-video.mp4
# Takes any real clip (8 s or longer), crossfades the last second into the first second so it loops
# seamlessly, scales to 1920x1080 at 24 fps, removes audio and writes assets/video/hero.mp4 and hero.webm.
# Needs ffmpeg and ffprobe. Aim for under 4 MB per file.
set -e
IN="${1:-raw.mp4}"
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN" | awk '{printf "%d",$1}')
[ "$D" -ge 8 ] || { echo "Clip must be at least 8 seconds"; exit 1; }
mkdir -p assets/video
ffmpeg -y -i "$IN" -filter_complex \
"[0:v]trim=1:$((D-1)),setpts=PTS-STARTPTS[body];[0:v]trim=$((D-1)):$D,setpts=PTS-STARTPTS[t];[0:v]trim=0:1,setpts=PTS-STARTPTS[h];[t][h]xfade=transition=fade:duration=1:offset=0[x];[body][x]concat=n=2:v=1:a=0[c];[c]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=24[v]" \
-map "[v]" loop.mp4
ffmpeg -y -i loop.mp4 -an -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart assets/video/hero.mp4
ffmpeg -y -i loop.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 35 assets/video/hero.webm
rm -f loop.mp4
ls -lh assets/video

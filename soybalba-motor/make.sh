#!/bin/bash
# make.sh vid kind [musicgain]
set -e
cd "$(dirname "$0")"
V=$1; K=$2; G=${3:-1}
(cd eng && node render.js $V)
python3 audio.py $V $K $G
mkdir -p out
ffmpeg -y -v error -i build/${V}_video.mp4 -f f32le -ar 44100 -ac 1 -i build/${V}_mix.f32 -c:v copy -c:a aac -b:a 192k -ar 44100 -shortest -movflags +faststart out/${V}.mp4
echo "DONE $V $(ffprobe -v error -show_entries format=duration -of csv=p=0 out/${V}.mp4)"

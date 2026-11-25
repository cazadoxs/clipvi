#!/bin/bash
# sheet.sh vid t1 t2 ...
V=$1; shift; i=0; args=""
mkdir -p prev/tmp; rm -f prev/tmp/*
for t in "$@"; do ffmpeg -v error -y -ss $t -i out/$V.mp4 -frames:v 1 -vf scale=270:480 prev/tmp/$(printf %02d $i).jpg; i=$((i+1)); done
ffmpeg -v error -y -i prev/tmp/%02d.jpg -vf tile=${i}x1 prev/sheet_$V.jpg

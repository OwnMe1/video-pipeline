#!/usr/bin/env bash
find public/audio_bank -type f \( -iname "*.mp3" -o -iname "*.wav" -o -iname "*.ogg" \) | sort

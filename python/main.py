import sys
import os
import ffmpeg
import re

def compress_video(video_full_path, output_file_name, target_size):
    min_audio_bitrate = 32000
    max_audio_bitrate = 256000

    probe = ffmpeg.probe(video_full_path)
    duration = float(probe['format']['duration'])

    audio_stream = next((s for s in probe['streams'] if s['codec_type'] == 'audio'), None)
    audio_bitrate = float(audio_stream['bit_rate']) if audio_stream and 'bit_rate' in audio_stream else 128000

    target_total_bitrate = (target_size * 1024 * 8) / (1.073741824 * duration)

    if 10 * audio_bitrate > target_total_bitrate:
        audio_bitrate = target_total_bitrate / 10
        if audio_bitrate < min_audio_bitrate < target_total_bitrate:
            audio_bitrate = min_audio_bitrate
        elif audio_bitrate > max_audio_bitrate:
            audio_bitrate = max_audio_bitrate

    video_bitrate = target_total_bitrate - audio_bitrate

    process = (
        ffmpeg
        .input(video_full_path)
        .output(
            output_file_name,
            **{'c:v': 'libx264', 'b:v': str(int(video_bitrate)) + 'k',
               'c:a': 'aac', 'b:a': str(int(audio_bitrate)) + 'k'}
        )
        .overwrite_output()
        .run_async(pipe_stderr=True)
    )

    time_pattern = re.compile(r'time=(\d+):(\d+):(\d+\.\d+)')

    for line in process.stderr:
        line = line.decode('utf-8', errors='ignore').strip()
        match = time_pattern.search(line)
        if match:
            h, m, s = match.groups()
            current_time = int(h) * 3600 + int(m) * 60 + float(s)
            progress = current_time / duration
            print(f"PROGRESS:{progress:.4f}", flush=True)

    process.wait()

if __name__ == "__main__":
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    target_size = int(sys.argv[3])
    compress_video(input_file, output_file, target_size)

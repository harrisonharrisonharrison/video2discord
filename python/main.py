import sys
import os
import ffmpeg

def compress_video(video_full_path, output_file_name, target_size):
    min_audio_bitrate = 32000
    max_audio_bitrate = 256000

    probe = ffmpeg.probe(video_full_path)
    duration = float(probe['format']['duration'])
    print(f"DURATION={duration}", flush=True)
    audio_bitrate = float(next((s for s in probe['streams'] if s['codec_type'] == 'audio'), None)['bit_rate'])
    target_total_bitrate = (target_size * 1024 * 8) / (1.073741824 * duration)

    if 10 * audio_bitrate > target_total_bitrate:
        audio_bitrate = target_total_bitrate / 10
        if audio_bitrate < min_audio_bitrate < target_total_bitrate:
            audio_bitrate = min_audio_bitrate
        elif audio_bitrate > max_audio_bitrate:
            audio_bitrate = max_audio_bitrate

    audio_bitrate = int(audio_bitrate)
    video_bitrate = max(100_000, int(target_total_bitrate - audio_bitrate))  # at least ~100 kbps

    i = ffmpeg.input(video_full_path)
    ffmpeg.output(
        i,
        os.devnull,
        **{'c:v': 'libx264', 'b:v': str(video_bitrate), 'pass': 1, 'f': 'mp4'}
    ).overwrite_output().run()

    ffmpeg.output(
        i,
        output_file_name,
        **{'c:v': 'libx264', 'b:v': str(video_bitrate), 'pass': 2, 'c:a': 'aac', 'b:a': str(audio_bitrate)}
    ).overwrite_output().run()

if __name__ == "__main__":
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    target_size = int(sys.argv[3]) * 1024
    compress_video(input_file, output_file, target_size)
import subprocess
import os

def download_tiktok_video(url: str, output_path="videos/video.mp4"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    command = [
        "yt-dlp",
        "-f", "mp4",
        "-o", output_path,
        url
    ]

    subprocess.run(command, check=True)
    return output_path


def extract_audio(video_path: str, audio_path="audio/audio.wav"):
    os.makedirs(os.path.dirname(audio_path), exist_ok=True)

    command = [
        "ffmpeg",
        "-y",
        "-i", video_path,
        "-ar", "16000",
        "-ac", "1",
        audio_path
    ]

    subprocess.run(command, check=True)
    return audio_path


import whisper

def transcribe_audio(audio_path: str, model_size="small"):
    model = whisper.load_model(model_size)
    result = model.transcribe(audio_path)

    return result["text"]


def transcribe_tiktok(url: str):
    print("⬇️ Downloading video...")
    video_path = download_tiktok_video(url)

    print("🎧 Extracting audio...")
    audio_path = extract_audio(video_path)

    print("🧠 Transcribing...")
    text = transcribe_audio(audio_path)

    return text


def clean_transcript(text: str):
    text = text.replace("\n", " ").strip()
    return text



if __name__ == "__main__":
    tiktok_url = "https://www.tiktok.com/@alwaysfit.com.br/video/7573295315529452807?q=ALWAYS%20FIT&t=1767906486805"

    transcript = transcribe_tiktok(tiktok_url)

    print("\n📜 TRANSCRIPT:\n")
    print(transcript)

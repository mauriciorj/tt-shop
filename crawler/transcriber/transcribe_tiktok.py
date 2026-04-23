import os
import sys
import subprocess
import whisper
from convex import ConvexClient
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

def get_convex_client() -> ConvexClient:
    if not CONVEX_URL:
        raise EnvironmentError("NEXT_PUBLIC_CONVEX_URL env var is not set")
    return ConvexClient(CONVEX_URL)


def fetch_video(client: ConvexClient, convex_id: str) -> dict:
    video = client.query("videos:getVideoById", {"id": convex_id})
    if not video:
        raise ValueError(f"No video found with id: {convex_id}")
    return video


def build_tiktok_url(video: dict) -> str:
    tt_account = video.get("tt_account")
    k_id = video.get("k_id")
    if not tt_account or not k_id:
        raise ValueError(f"Video is missing tt_account or k_id: {video}")
    return f"https://www.tiktok.com/@{tt_account}/video/{k_id}"


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


def transcribe_audio(audio_path: str, model_size="small") -> dict:
    model = whisper.load_model(model_size)
    result = model.transcribe(audio_path, language="pt")
    return result


def format_block(text: str) -> str:
    """Capitalize first letter and add paragraph breaks at sentence boundaries."""
    import re
    text = text.strip()
    if not text:
        return text
    text = text[0].upper() + text[1:]
    # Insert line break after sentence-ending punctuation followed by more text
    text = re.sub(r'([.?!])\s+(?=[A-Za-zÀ-ÿ])', r'\1\n', text)
    return text


def format_transcript_blocks(segments: list, min_block_sec: float = 5.0, max_block_sec: float = 10.0) -> str:
    """
    Groups Whisper segments into blocks of 5-10 seconds each.
    Each block starts with a capital letter.
    Sentence boundaries within a block become paragraph breaks.
    """
    blocks = []
    current_texts = []
    block_start = None

    for segment in segments:
        seg_start = float(segment["start"])
        seg_end = float(segment["end"])
        seg_text = segment["text"].strip()

        if not seg_text:
            continue

        if block_start is None:
            block_start = seg_start

        current_texts.append(seg_text)
        duration = seg_end - block_start

        # Close block when we hit min duration; force-close at max duration
        if duration >= min_block_sec:
            blocks.append(" ".join(current_texts))
            current_texts = []
            block_start = None

    if current_texts:
        blocks.append(" ".join(current_texts))

    return "\n\n".join(format_block(b) for b in blocks if b.strip())


def transcribe_tiktok(url: str, k_id: str) -> str:
    print("Downloading video...")
    output_path = f"videos/{k_id}.mp4"
    video_path = download_tiktok_video(url, output_path)

    print("Extracting audio...")
    audio_path = f"audio/{k_id}.wav"
    audio = extract_audio(video_path, audio_path)

    print("Transcribing (pt-BR)...")
    result = transcribe_audio(audio)

    return format_transcript_blocks(result["segments"])


def save_transcription(client: ConvexClient, convex_id: str, transcription: str):
    client.mutation("videos:updateVideoTranscription", {
        "id": convex_id,
        "transcription": transcription,
    })


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python transcribe_tiktok.py <convex_video_id>")
        sys.exit(1)

    convex_id = sys.argv[1]

    client = get_convex_client()

    print(f"Fetching video {convex_id} from Convex...")
    video = fetch_video(client, convex_id)
    k_id = video.get("k_id")

    tiktok_url = build_tiktok_url(video)
    print(f"TikTok URL: {tiktok_url}")

    transcription = transcribe_tiktok(tiktok_url, k_id)

    print("\nTRANSCRIPT:\n")
    print(transcription)

    print("\nSaving to Convex...")
    save_transcription(client, convex_id, transcription)
    print("Done.")

# Crawler

The crawler is a Python tool that fetches TikTok Shop data from the Kalodata API and writes it into Convex. It runs separately from the Next.js app.

**Path:** `crawler/`

```
crawler/
├── kalodata/       # Main data crawler (products, stores, videos, categories)
└── transcriber/    # TikTok video transcription via OpenAI Whisper
```

---

## Kalodata Crawler

**Path:** `crawler/kalodata/`

Scrapes top products, stores, videos, and categories from Kalodata and upserts them into the Convex `products`, `stores`, `videos`, and `categories` tables.

### Setup

```bash
cd crawler

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
python3 -m pip install --upgrade pip
pip install -r ./kalodata/requirements.txt
```

### Environment Variables

```bash
KALODATA_USER       # Kalodata account username
KALODATA_PASSWORD   # Kalodata account password
NEXT_PUBLIC_CONVEX_URL  # Convex deployment URL
```

### Run

```bash
python3 ./kalodata/main.py
```

### Architecture

```
main.py
  └─ handlers_control.py         # Orchestrates all request handlers
       ├─ request_categories/    # Fetch category hierarchy
       ├─ request_top_products/  # Fetch top products list
       │    └─ convex/           # Upsert into Convex `products`
       ├─ request_top_products_details/  # Fetch detailed analytics per product
       ├─ request_top_stores/    # Fetch top stores list
       │    └─ convex/           # Upsert into Convex `stores`
       ├─ request_top_stores_details/   # Fetch detailed analytics per store
       ├─ request_top_videos/    # Fetch top videos list
       │    └─ convex/           # Upsert into Convex `videos`
       └─ request_video_details/ # Fetch analytics per video
```

Each request handler has:
- `request_api/` — API call logic (uses `cookies.json` for session auth)
- `convex/` — Convex mutation calls to write data

`response json samples/` contains example API responses from Kalodata (useful for understanding the shape of incoming data).

### Authentication

The crawler authenticates to Kalodata using browser cookies (`cookies.json`). `selenium_utils.py` handles Selenium-based login refresh when cookies expire.

---

## Transcriber

**Path:** `crawler/transcriber/`

Downloads a TikTok video from Convex, extracts its audio, and transcribes it with OpenAI Whisper. The transcript is stored in the `videos.transcription` field.

### Setup

```bash
cd crawler/transcriber

# System dependencies
brew install ffmpeg
brew install llvm
export LLVM_DIR="/usr/local/opt/llvm/lib/cmake/llvm"

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate
python3 -m pip install --upgrade pip

# Python dependencies
pip3 install git+https://github.com/openai/whisper.git
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install yt-dlp
pip install convex
```

### Environment Variables

```bash
CONVEX_URL=https://your-deployment.convex.cloud
```

### Run

```bash
python transcribe_tiktok.py <convex_video_id>
```

Example:
```bash
python transcribe_tiktok.py jd7abc123def456
```

The `convex_video_id` is the `_id` field from the Convex `videos` table (not `k_id`).

### Workflow

1. Look up the video record in Convex by `_id`
2. Download the TikTok video using `yt-dlp`
3. Extract audio with `FFmpeg`
4. Transcribe with OpenAI Whisper (runs locally)
5. Save transcript text to `videos.transcription` via Convex mutation

### Usage Limits

Transcription access is gated by `transcriptionLogs` in Convex:
- **1 new video per user per day**
- Re-viewing a previously transcribed video does not count against the limit

See [[database]] → `transcriptionLogs` table.

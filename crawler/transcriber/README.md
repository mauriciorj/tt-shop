## How to start

### cd transcriber

## Setup the Python

### Install the dependencies

#### brew install ffmpeg

### pip upgrade

#### pip install --upgrade pip

### Create your new virtual environment

#### python3 -m venv venv

### Access the new virtual environment

#### source venv/bin/activate

### Upgrade to the last pip version

#### python3 -m pip install --upgrade pip

#### brew install llvm

### Export LLVM

### export LLVM_DIR="/usr/local/opt/llvm/lib/cmake/llvm"

### Install Whiper OpenAI

#### pip3 install git+https://github.com/openai/whisper.git

### Check the last Whisper version: https://github.com/openai/whisper

```
pip3 install git+https://github.com/openai/whisper.git

pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install yt-dlp
```

### Install the Convex Python client

#### pip install convex

### Set the CONVEX_URL environment variable

#### export CONVEX_URL=https://your-deployment.convex.cloud

### Now it's ready to run

#### python transcribe_tiktok.py <convex_video_id>

Example:
```
python transcribe_tiktok.py jd7abc123def456
```

### Stop the virtual environment

#### deactivate

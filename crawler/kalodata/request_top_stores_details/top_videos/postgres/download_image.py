import sys
import os
import requests

# getting the name of the directory
# where the this file is present.
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current) # kalodata
parent_parent = os.path.dirname(parent) # selenium
parent_parent_parent = os.path.dirname(parent_parent) # crawler

# adding the parent directory to
# the sys.path.
sys.path.append(parent_parent_parent)

from utils.save_error import save_error

def download_image(video_id, k_id):
    try:
        project_root = os.path.dirname(parent_parent_parent)
        images_dir = os.path.join(project_root, 'public', 'images', 'videos')
        if not os.path.exists(images_dir):
            os.makedirs(images_dir)
                
        image_url = f"https://img.kalocdn.com/tiktok.video/{k_id}/cover.png"
        image_path = os.path.join(images_dir, f"{video_id}.png")
                
        # Check if image already exists to avoid re-downloading (optional, but good practice)
        # But user requirement implies we should ensure it's there. Overwriting is safer if image changed.
                
        response = requests.get(image_url, stream=True)
        if response.status_code == 200:
            with open(image_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f'[ SELENIUM ] downloaded image for store: {video_id}')
        else:
            print(f"[ SELENIUM ] Failed to download image for store {video_id} (k_id: {k_id}). Status: {response.status_code}")
    except Exception as e_img:
        save_error(source='request_top_stores_details/top_videos/postgres/download_image', error=e_img)
        sys.exit(1)
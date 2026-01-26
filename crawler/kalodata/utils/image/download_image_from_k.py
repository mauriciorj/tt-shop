import sys
import os
import requests

from utils.save_error import save_error
# from logger.error import error

def download_image_from_k(k_id, type):
    try:
        images_dir = os.path.join('images')
        if not os.path.exists(images_dir):
            os.makedirs(images_dir)

        image_url = None

        if type == "store":
            image_url = f"https://img.kalocdn.com/tiktok.seller/{k_id}/logo.png"
        elif type == "video":
            image_url = f"https://img.kalocdn.com/tiktok.video/{k_id}/cover.png"
        
        image_path = os.path.join(images_dir, f"{k_id}.png")
                
        response = requests.get(image_url, stream=True)

        if response.status_code == 200:
            with open(image_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
        
            return image_path
        else:
            return False
    except Exception as e:
        save_error(source=f'{k_id}-{type}/download_image_from_k', error=e)
        # error(e, 111)
        sys.exit(1)
import sys
import os
import requests

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from utils.save_error import save_error
# from logger.error import error
 
def download_image_from_convex(storage_id):
    try:
        client = ConvexClient(CONVEX_URL)
        
        response_url = client.query("files:getUrl", {'storageId': storage_id})

        if not response_url:
            return False

        download_image = requests.get(response_url, stream=True)
        
        if download_image.status_code == 200:
            images_dir = os.path.join('images')
            image_path = os.path.join(images_dir, f"{id}_convex.png")
            
            with open(image_path, 'wb') as f:
                for chunk in download_image.iter_content(1024):
                    f.write(chunk)
        
            return image_path
        else:
            return False

    except Exception as e:
        save_error(source=f'{k_id}-{id}-{type}/download_image_from_convex', error=e)
        # error(e, 111)
        sys.exit(1)
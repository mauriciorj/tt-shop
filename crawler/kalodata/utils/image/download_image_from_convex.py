import sys
import os
import requests

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from utils.save_error import save_error
 
def download_image_from_convex(k_id, type):
    try:
        client = ConvexClient(CONVEX_URL)

        convex_item = None

        # STEP 01 - Check if there storage_id
        if type == 'store':
            convex_item = client.query("stores:getStoreByKId", {'k_id': k_id})
        elif type == 'product':
            convex_item = client.query("products:getProductByKId", {'k_id': k_id})
        
        # STEP 02 - If there is no storage_id: means there is no storage_id in the table and there is no image in Convex
        if convex_item is None or convex_item['storage_id'] is None:
            return None, None

        # STEP 03 - Get the image URL from Convex to download the image
        response_url = client.query("files:getUrl", {'storageId': convex_item['storage_id']})
        
        # STEP 04 - If there is no response_url: means there is no image in Convex but there is a storage_id in the table
        # this image probably is not update and must be deleted
        if not response_url:
            return None, None

        # STEP 05 - If there is a response_url: Download the image
        download_image = requests.get(response_url, stream=True)

        # STEP 06 - If the download_image status code is 200, save the file
        if download_image.status_code == 200:
            images_dir = os.path.join('images')
            image_path = os.path.join(images_dir, f"{convex_item['storage_id']}_convex.png")
            
            with open(image_path, 'wb') as f:
                for chunk in download_image.iter_content(1024):
                    f.write(chunk)
        
            return image_path, convex_item['storage_id']
        # STEP 07 - If the download_image status code is not 200, return None, None
        # It will avoid to delete the image from Convex
        else:
            save_error(source=f'utils/image/download_image_from_convex-{k_id}-{type}', error=f'Image not downloaded for {type}: {k_id}')
            return None, None

    except Exception as e:
        save_error(source=f'utils/image/download_image_from_convex-{k_id}-{type}', error=e)
import sys
import os
import requests

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from utils.save_error import save_error
# from logger.error import error

def image_handler(k_id, id, status, type):
    try:
        client = ConvexClient(CONVEX_URL)
        
        images_dir = os.path.join('images')
        if not os.path.exists(images_dir):
            os.makedirs(images_dir)
                
        image_url = None

        if type == "store":
            image_url = f"https://img.kalocdn.com/tiktok.seller/{k_id}/logo.png"
        elif type == "video":
            image_url = f"https://img.kalocdn.com/tiktok.video/{k_id}/cover.png"
        
        image_path = os.path.join(images_dir, f"{id}.png")
                
        response = requests.get(image_url, stream=True)

        if response.status_code == 200:
            with open(image_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)

            # if status == 'updated':
            # download the image from database
            
            # Compare both images
            

            # If the image is different, then the image in the database must be updated
            upload_url = client.mutation("files:generateUploadUrl")
            
            with open(image_path, 'rb') as f:
                headers = {'Content-Type': 'application/octet-stream'} # Or detect file specific type
                response_upload_url = requests.post(upload_url, headers=headers, data=f)
                response_upload_url.raise_for_status() # Raise an exception for bad status codes
        
            # The response_upload_url from the POST request contains the storageId
            result = response_upload_url.json()
            storage_id = result['storageId']

            # 3. Save the storage ID into your database
            file_name = os.path.basename(image_path)
            client.mutation("files:saveFile", {'storageId': storage_id, 'table_id': id, 'k_id': k_id, 'source': 'video'})

            
        else:
            print(f"[ SELENIUM ] Failed to download image for store {id} (k_id: {k_id}). Status: {response.status_code}")
    except Exception as e:
        save_error(source=f'{type}/image_handler', error=e)
        # error(e, 111)
        sys.exit(1)
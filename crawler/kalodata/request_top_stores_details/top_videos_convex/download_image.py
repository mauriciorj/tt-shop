import sys
import os
import requests

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from logger.error import error

def download_image(k_id, video_id):
    try:
        client = ConvexClient(CONVEX_URL)
        
        images_dir = os.path.join('images')
        if not os.path.exists(images_dir):
            os.makedirs(images_dir)
                
        image_url = f"https://img.kalocdn.com/tiktok.video/{k_id}/cover.png"
        image_path = os.path.join(images_dir, f"{video_id}.png")
                
        response = requests.get(image_url, stream=True)

        if response.status_code == 200:
            with open(image_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)

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
            client.mutation("files:saveFile", {'storageId': storage_id, 'table_id': video_id, 'k_id': k_id, 'source': 'video'})

            
        else:
            print(f"[ SELENIUM ] Failed to download image for store {video_id} (k_id: {k_id}). Status: {response.status_code}")
    except Exception as e:
        error(e, 111)
        sys.exit(1)
import sys
import os
import requests

from PIL import Image, ImageChops

from convex import ConvexClient
from dotenv import load_dotenv

from utils.image.get_file_url import get_file_url

load_dotenv(".env")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from utils.save_error import save_error

def upload_image_to_convex(image_path):
    try:
        client = ConvexClient(CONVEX_URL)
        
        # STEP 01 - Generate upload URL
        upload_url = client.mutation("files:generateUploadUrl")
        
        with open(image_path, 'rb') as f:
            headers = {'Content-Type': 'application/octet-stream'} # Or detect file specific type
            response_upload_url = requests.post(upload_url, headers=headers, data=f)
            response_upload_url.raise_for_status() # Raise an exception for bad status codes
        
        # STEP 02 - The response_upload_url from the POST request contains the storageId
        result = response_upload_url.json()
        storage_id = result['storageId']

        # STEP 03 - Save the storage ID into your database
        file_name = os.path.basename(image_path)

        image_url = get_file_url(storage_id)

        # STEP 04 - Return the storage ID
        return storage_id, image_url

    except Exception as e:
        save_error(source='utils/image/upload_image_to_convex', error=e)
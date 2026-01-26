import sys
import os
import requests

from PIL import Image, ImageChops

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from utils.save_error import save_error
# from logger.error import error

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

        # STEP 04 - Return the storage ID
        return storage_id

        # client.mutation("files:saveFile", {'storageId': storage_id, 'table_id': id, 'k_id': k_id, 'source': type})

    except Exception as e:
        save_error(source='upload_image_to_convex', error=e)
        # error(e, 111)
        sys.exit(1)
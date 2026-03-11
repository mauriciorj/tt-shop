import sys
import os
import requests

from PIL import Image, ImageChops

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from utils.save_error import save_error

def get_file_url(storageId):
    try:
        client = ConvexClient(CONVEX_URL)
        
        # STEP 01 - Get the File URL
        file_url = client.query("files:getUrl", {'storageId': storageId})
        
        return file_url

    except Exception as e:
        save_error(source='utils/image/get_url', error=e)
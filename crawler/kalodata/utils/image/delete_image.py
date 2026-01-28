import sys
import os
import requests

from utils.save_error import save_error

from PIL import Image, ImageChops

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from utils.save_error import save_error

def delete_image(storage_id):
    try:
        client = ConvexClient(CONVEX_URL)
        client.mutation("files:deleteFile", {'storage_id': storage_id})
    except Exception as e:
        save_error(source=f'utils/image/delete_image', error=e)
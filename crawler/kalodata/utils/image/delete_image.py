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

def delete_image(k_id, id):
    print('\n')
    print('\n')
    print('\n')
    print('\n')
    print('\n')
    print('[ CONVEX ] delete_image k_id => ', k_id)
    print('[ CONVEX ] delete_image id => ', id)
    print('\n')
    print('\n')
    print('\n')
    print('\n')
    try:
        client = ConvexClient(CONVEX_URL)
        client.mutation("files:deleteFile", {'table_id': id, 'k_id': k_id})
    except Exception as e:
        save_error(source=f'image/delete_image', error=e)
        # error(e, 111)
        sys.exit(1)
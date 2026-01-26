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

from utils.image.download_image_from_convex import download_image_from_convex
from utils.image.download_image_from_k import download_image_from_k
from utils.image.compare_images import compare_images
from utils.image.upload_image_to_convex import upload_image_to_convex
from utils.image.delete_image import delete_image

def main(k_id, id, storage_id, status, type):
    try:
        # STEP 01 - Download image from Kalodata API
        k_image_path = download_image_from_k(k_id, id, type)

        # STEP 02 - Download image from Convex if k_image_path is not None
        if k_image_path:

            if storage_id:
                convex_image_path = download_image_from_convex(storage_id)
            else:
                convex_image_path = None

            # STEP 03 - Compare images if convex_image_path is not None
            if convex_image_path:
                compare_images_result = compare_images(k_image_path, convex_image_path)
                if compare_images_result:
                    # Don't update image
                    return
                else:
                    # Delete image from Convex
                    delete_image(storage_id)

            # STEP 04 - Upload image to Convex
            new_storage_id = upload_image_to_convex(k_image_path)
            return new_storage_id
            print('[ CONVEX ] Image Handler finished')

        else:
            print(f"[ SELENIUM ] Failed to download image for store {id} (k_id: {k_id}).")
    except Exception as e:
        save_error(source=f'{type}/image_handler', error=e)
        # error(e, 111)
        sys.exit(1)

if __name__ == "__main__":
    main()

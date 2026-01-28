import sys
import os
import requests

from utils.save_error import save_error

from utils.image.download_image_from_convex import download_image_from_convex
from utils.image.download_image_from_k import download_image_from_k
from utils.image.compare_images import compare_images
from utils.image.upload_image_to_convex import upload_image_to_convex

def main(k_id, type):
    try:
        print("")
        print("[ CONVEX ] Handling image...")
        # STEP 01 - Download image from Kalodata API
        k_image_path = download_image_from_k(k_id, type)

        # STEP 02 - Check if k_image_pat exists
        if k_image_path:

            # STEP 04 - Download image from Convex and return the convex_image_path and storage_id
            convex_image_path, storage_id = download_image_from_convex(k_id, type)

            # STEP 05 - If convex_image_path exists it means the image was downloaded successfully
            # Compare k_image and convex images
            if convex_image_path:
                compare_images_result = compare_images(k_image_path, convex_image_path)
                # STEP 06 - If images are the same, don't update image
                if compare_images_result:
                    return

            # STEP 08 - Upload k_image to Convex
            new_storage_id = upload_image_to_convex(k_image_path)
            return new_storage_id
            print('[ CONVEX ] Image Handler finished')

        else:
            print(f"[ SELENIUM ] Failed to download image for store (k_id: {k_id}).")
    except Exception as e:
        save_error(source=f'utils/image/main-{k_id}-{type}', error=e)

if __name__ == "__main__":
    main()

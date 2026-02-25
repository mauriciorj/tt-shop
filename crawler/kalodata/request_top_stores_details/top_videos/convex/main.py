import os
import sys

from convex import ConvexClient
from dotenv import load_dotenv

from utils.image.main import main as image_handler
from utils.delete_images import delete_images

from utils.save_error import save_error

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

def main(formated_data):
    print('')
    print('[ SELENIUM ] Saving Top Videos to DB...')

    try:
        client = ConvexClient(CONVEX_URL)
        
        for item in formated_data:
            # STEP 01 - Handle images
            new_storage_id, image_url = image_handler(k_id=item['k_id'], type='video', client=client)

            # STEP 02 - Add storage_id to item
            if new_storage_id:
                item['storage_id'] = new_storage_id

            # STEP 03 - Add image to item
            if image_url:
                item['image'] = image_url

            # STEP 04 - Add / Update video
            video_id = client.mutation("videos:updateVideos", item)

            print("[ CONVEX ] Updated video...")

            # STEP 05 - Delete images from /images local folder
            delete_images()


        print('[ SELENIUM ] Top Videos saved successfully')
        print("")


    except Exception as e:
        save_error(source='request_top_stores_details/top_videos/convex/main', error=e)

if __name__ == "__main__":
    main()

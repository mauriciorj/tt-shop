import os

from convex import ConvexClient
from dotenv import load_dotenv

from utils.image.main import main as image_handler
from utils.delete_images import delete_images

from utils.save_error import save_error

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

def main(data):
    print('')
    print('[ SELENIUM ] Saving Top Videos to DB...')

    try:
        client = ConvexClient(CONVEX_URL)

        for item in data:
            # STEP 01 - Handle images
            new_storage_id = image_handler(k_id=item['k_id'], type='video')

            # STEP 02 - Add storage_id to item
            if new_storage_id:
                item['storage_id'] = new_storage_id

            print("[ CONVEX ] Adding / Updating video...")

            # STEP 03 - Add / Update video
            video_id = client.mutation("videos:updateVideos", {'data': item})

            print("[ CONVEX ] Updated video...")

            # STEP 04 - Delete images from /images local folder
            delete_images()


        print('[ SELENIUM ] Top Videos saved successfully')
        print("")


    except Exception as e:
        save_error(source='request_top_products_details/top_videos/convex/main', error=e)

    finally:
        print("[ SELENIUM ] Closing connection...")
        return True

if __name__ == "__main__":
    main()
    
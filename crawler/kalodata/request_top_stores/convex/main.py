import os

from convex import ConvexClient
from dotenv import load_dotenv

from utils.image.main import main as image_handler
from utils.delete_images import delete_images

from utils.save_error import save_error

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

def main(data):
    print("")
    print("[ CONVEX ] Adding / Updating stores...")
    
    try:
        client = ConvexClient(CONVEX_URL)
        
        for item in data:
            # STEP 01 - Handle images
            new_storage_id = image_handler(k_id=item['k_id'], type='store')

            # STEP 02 - Add storage_id to item
            if new_storage_id:
                item['storage_id'] = new_storage_id

            print("[ CONVEX ] Adding / Updating store...")

            # STEP 03 - Add / Update store
            result = client.mutation("stores:addStore", {'data': item})
            
            print("[ CONVEX ] Updated store...")
            
            # STEP 04 - Delete images from /images local folder
            delete_images()

        print("[ CONVEX ] Stores added / updated successfully")
        print("")

    except Exception as e:
        save_error(source='request_top_stores/convex/main', error=e)

if __name__ == "__main__":
    main()
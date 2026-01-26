import os
import sys

from convex import ConvexClient
from dotenv import load_dotenv

from utils.image.main import main as image_handler
from utils.delete_images import delete_images

from utils.save_error import save_error
# from logger.error import error

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

def main(formated_data):
    print("")
    print("[ CONVEX ] Adding / Updating stores...")
    
    try:
        client = ConvexClient(CONVEX_URL)
        
        for item in formated_data:
            # STEP 01 - Handle images
            new_storage_id = image_handler(k_id=item['k_id'], id=result['id'], storage_id=result['storage_id'], status=result['status'], type='store')

            if new_storage_id:
                item.storage_id = new_storage_id

            # STEP 02 - Add / Update store
            result = client.mutation("stores:addStore", {'data': item})
            
            delete_images()

        print("[ CONVEX ] Stores added / updated successfully")
        print("")

    except Exception as e:
        save_error(source='top_stores/convex', error=e)
        # error(e, 8)
        sys.exit(1)

if __name__ == "__main__":
    main()
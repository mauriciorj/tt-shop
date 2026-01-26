import os
import sys

from convex import ConvexClient
from dotenv import load_dotenv

# from utils.image_handler import image_handler

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
            result = client.mutation("stores:addStore", {'data': item})

            image_handler(k_id=item['k_id'], id=result['id'], status=result['status'], type='store')
            
            print('\n')
            print('\n')
            print('\n')
            print(f"[ CONVEX ] Store added / updated successfully {result}")
            print('\n')
            print('\n')
            print('\n')

        print("[ CONVEX ] Stores added / updated successfully")
        print("")

    except Exception as e:
        save_error(source='top_stores/convex', error=e)
        # error(e, 8)
        sys.exit(1)

if __name__ == "__main__":
    main()
import os

from utils.save_error import save_error

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

def convex(data):
    print('')
    print('[ SELENIUM ] Updating product in DB...')

    try:
        client = ConvexClient(CONVEX_URL)

        if 'id' in data:
            del data['id']
        
        client.mutation("products:updateProduct", data)

        print('')
        print(f"[ SELENIUM ] Processed items successfully.")

    except Exception as e:
        save_error(source='request_top_products_details/convex', error=e)

    finally:
        return True

import os
import sys

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from utils.save_error import save_error

def convex(data_map):
    print('')
    print('[ SELENIUM ] Updating store in DB...')

    try:
        client = ConvexClient(CONVEX_URL)

        del data_map['id']
        
        client.mutation("stores:updateStore", data_map)

        print('')
        print(f"[ SELENIUM ] Processed items successfully.")

    except Exception as e:
        save_error(source='request_top_stores_details/convex', error=e)

    finally:
        return True

import os
import sys

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from logger.error import error

def convex(data_map):
    print('')
    print('[ SELENIUM ] Updating store in DB...')

    try:
        client = ConvexClient(CONVEX_URL)
        
        client.mutation("stores:updateStoreDetails", {'data': data_map})

        print('')
        print(f"[ SELENIUM ] Processed items successfully.")

    except Exception as e:
        error(e, 10)
        sys.exit(1)

    finally:
        return True

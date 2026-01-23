import os
import sys

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from logger.error import error
from request_top_products_details.top_creators_convex.download_image import download_image


def update_db(formated_data):
    print('')
    print('[ SELENIUM ] Saving Top Creators to DB...')

    try:
        client = ConvexClient(CONVEX_URL)

        for item in formated_data:
            k_id = item['k_id']

            creator_id = client.mutation("creators:updateCreator", {'data': item})

            if creator_id is not None:
                download_image(k_id, creator_id)
    
        print('[ SELENIUM ] Top Creators saved successfully')
            

    except Exception as e:
        error(e, 13)
        sys.exit(1)

    finally:
        print("[ SELENIUM ] Closing connection...")
        return True

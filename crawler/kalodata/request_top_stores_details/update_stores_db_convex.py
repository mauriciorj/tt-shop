import os
import sys

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from logger.error import error

def update_stores_db_convex(store_id, store_k_id, top_creators, top_store_products, top_videos, top_store_sales):
    print('')
    print('[ SELENIUM ] Updating store in DB...')

    try:
        client = ConvexClient(CONVEX_URL)

        # Mapping top_creators
        top_creators_list = [str(item['k_id']) for item in top_creators if 'k_id' in item]
        top_products_list = [str(item['k_id']) for item in top_store_products if 'k_id' in item]
        top_videos_list = [str(item['k_id']) for item in top_videos if 'k_id' in item]
        
        # Common data for both tables
        data_map = {
            'id': store_id,
            'k_id': store_k_id,
            'k_top_creators': top_creators_list,
            'k_top_products': top_products_list,
            'k_top_videos': top_videos_list,
            'k_day_sales': top_store_sales['k_day_sales'],
            'k_day_revenue': top_store_sales['k_day_revenue'],
        }

        # print('\n')
        # print('\n')
        # print('\n')
        # print('\n')
        # print(data_map)
        
        client.mutation("stores:updateStoreDetails", {'data': data_map})

        print('')
        print(f"[ SELENIUM ] Processed items successfully.")

    except Exception as e:
        error(e, 10)
        sys.exit(1)

    finally:
        return True

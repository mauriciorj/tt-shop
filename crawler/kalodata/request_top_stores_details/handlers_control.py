from request_top_stores_details.top_creators.main import main as top_creators_main
from request_top_stores_details.top_store_products.main import main as store_details_products_main
from request_top_stores_details.top_videos.main import main as top_videos_main
from request_top_stores_details.top_store_sales.main import main as top_store_sales_main

from request_top_stores_details.convex import convex
from request_top_stores_details.postgres import postgres_update


def handlers_control(driver, request_db_result, type, page):
    print('[ SELENIUM ] Starting the requests...')

    for store in request_db_result:
        store_id = store['_id']
        store_k_id = store['k_id']

        # Top creators
        top_creators = top_creators_main(driver, store_k_id, type, page)

        # Request products details
        top_store_products = store_details_products_main(driver, store_k_id, page)

        # # Request the list of the top video
        top_videos = top_videos_main(driver, store_k_id, type, page)

        # # Request the total sales
        top_store_sales = top_store_sales_main(driver, store_k_id, page)



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

        if type == 'convex':
            convex(data_map)
        elif type == 'postgres':
            postgres_update(data_map)
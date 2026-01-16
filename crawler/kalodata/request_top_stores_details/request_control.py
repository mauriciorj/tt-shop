from request_top_stores_details.top_creators.main import main as top_creators_main
from request_top_stores_details.top_store_products.main import main as store_details_products_main
from request_top_stores_details.top_videos.main import main as top_videos_main
from request_top_stores_details.top_store_sales.main import main as top_store_sales_main

from request_top_stores_details.update_stores_db import update_stores_db

def request_control(driver, result_request_all_top_stores_from_db):
    print('[ SELENIUM ] Starting the requests...')

    for store in result_request_all_top_stores_from_db:
        store_id = store[0]
        store_k_id = store[1]

        # Top creators
        top_creators = top_creators_main(driver, store_k_id)


        # # Request products details
        top_store_products = store_details_products_main(driver, store_k_id)


        # # Request the list of the top video
        top_videos = top_videos_main(driver, store_k_id)



        # # Request the total sales
        top_store_sales = top_store_sales_main(driver, store_k_id)



        update_stores_db(store_id, store_k_id, top_creators, top_store_products, top_videos, top_store_sales)
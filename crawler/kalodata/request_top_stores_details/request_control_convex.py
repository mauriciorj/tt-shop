from request_top_stores_details.top_creators_convex.main import main as top_creators_main
from request_top_stores_details.top_store_products_convex.main import main as store_details_products_main
from request_top_stores_details.top_videos_convex.main import main as top_videos_main
from request_top_stores_details.top_store_sales_convex.main import main as top_store_sales_main

from request_top_stores_details.update_stores_db_convex import update_stores_db_convex

def request_control_convex(request_db_result):
    print('[ SELENIUM ] Starting the requests...')

    for store in request_db_result:
        store_id = store['_id']
        store_k_id = store['k_id']

        # Top creators
        top_creators = top_creators_main()


        # Request products details
        top_store_products = store_details_products_main(store_k_id)


        # Request the list of the top video
        top_videos = top_videos_main(store_k_id)


        # Request the total sales
        top_store_sales = top_store_sales_main(store_k_id)



        update_stores_db_convex(store_id, store_k_id, top_creators, top_store_products, top_videos, top_store_sales)
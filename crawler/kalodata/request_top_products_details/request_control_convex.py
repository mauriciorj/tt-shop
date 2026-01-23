from request_top_products_details.top_creators_convex.main import main as top_creators_main
from request_top_products_details.top_videos_convex.main import main as top_videos_main
from request_top_products_details.top_store_sales_convex.main import main as top_store_sales_main
from request_top_products_details.update_stores_db_convex import update_stores_db_convex

def request_control_convex(request_db_result):
    # print('[ SELENIUM ] Requesting product by product...')

    for product in request_db_result:
        product_id = product['_id']
        product_k_id = product['k_id']

        # Top creators
        top_creators = top_creators_main()
        
        
        # Top videos
        top_videos = top_videos_main()


        # Request the total sales
        top_store_sales = top_store_sales_main()



        update_stores_db_convex(product_id, product_k_id, top_creators, top_videos, top_store_sales)
        
from request_top_products_details.top_creators.main import main as top_creators_main
from request_top_products_details.top_videos.main import main as top_videos_main
from request_top_products_details.top_products_sales.main import main as top_products_sales_main
from request_top_products_details.convex import convex
from request_top_products_details.postgres import postgres_update

def handlers_control(request_db_redriver, request_db_result, type, pagesult):
    print('[ SELENIUM ] Requesting product by product...')

    for product in request_db_result:
        product_id = product['_id']
        product_k_id = product['k_id']

        # Top creators
        top_creators = top_creators_main(driver, product_k_id, type, page)
        
        # Top videos
        top_videos = top_videos_main(driver, product_k_id, type, page)

        # Request the total sales
        top_products_sales = top_products_sales_main(driver, product_k_id, page)



        # Mapping top_creators
        top_creators_list = [str(item['k_id']) for item in top_creators if 'k_id' in item]
        top_videos_list = [str(item['k_id']) for item in top_videos if 'k_id' in item]
        
        # Common data for both tables
        data_map = {
            'id': product_id,
            'k_id': product_k_id,
            'k_top_creators': top_creators_list,
            'k_top_videos': top_videos_list,
            'k_day_sales': top_products_sales['k_day_sales'],
            'k_day_revenue': top_products_sales['k_day_revenue'],
        }

        if type == 'convex':
            convex(data_map)
        elif type == 'postgres':
            # do nothing
            pass
        
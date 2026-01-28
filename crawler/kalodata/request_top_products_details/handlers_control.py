from request_top_products_details.top_creators.main import main as top_creators
from request_top_products_details.top_videos.main import main as top_videos
from request_top_products_details.top_products_sales.main import main as top_products_sales
from request_top_products_details.convex import convex
from request_top_products_details.postgres import postgres_update

def handlers_control(driver, data, type, page):
    print('[ SELENIUM ] Requesting product by product...')

    for product in data:
        id = product['_id']
        k_id = product['k_id']

        # Top creators
        top_creators_result = top_creators(driver, k_id, type, page)
        
        # Top videos
        top_videos_result = top_videos(driver, k_id, type, page)

        # Request the total sales
        top_products_sales_result = top_products_sales(driver, k_id, page)



        # Mapping top_creators_result
        top_creators_list = [str(item['k_id']) for item in top_creators_result if 'k_id' in item]
        top_videos_list = [str(item['k_id']) for item in top_videos_result if 'k_id' in item]
        
        # Common data for both tables
        data_map = {
            'id': id,
            'k_id': k_id,
            'k_top_creators': top_creators_list,
            'k_top_videos': top_videos_list,
            'k_day_sales': top_products_sales_result['k_day_sales'],
            'k_day_revenue': top_products_sales_result['k_day_revenue'],
        }

        if type == 'convex':
            convex(data_map)
        elif type == 'postgres':
            # do nothing
            pass
        
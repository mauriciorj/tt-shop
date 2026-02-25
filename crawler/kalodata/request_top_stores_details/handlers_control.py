from request_top_stores_details.top_creators.main import main as top_creators
from request_top_stores_details.top_store_products.main import main as store_details_products
from request_top_stores_details.top_videos.main import main as top_videos
from request_top_stores_details.top_store_sales.main import main as top_store_sales

from request_top_stores_details.convex import convex


def handlers_control(driver, data, page):
    print('[ SELENIUM ] Starting the requests...')

    for store in data:
        id = store['_id']
        k_id = store['k_id']
        main_category = store['main_category']

        # Top creators
        top_creators_result = top_creators(driver, k_id, page)

        # Request products details
        top_store_products_result = store_details_products(driver, k_id, page)

        # # Request the list of the top video
        top_videos_result = top_videos(driver, k_id, page, main_category)

        # # Request the total sales
        top_store_sales_result = top_store_sales(driver, k_id, page)



        # Mapping top_creators
        top_creators_list = [str(item['k_id']) for item in top_creators_result if 'k_id' in item]
        top_products_list = [str(item['k_id']) for item in top_store_products_result if 'k_id' in item]
        top_videos_list = [str(item['k_id']) for item in top_videos_result if 'k_id' in item]



        # Common data for both tables
        data_map = {
            'id': id,
            'k_id': k_id,
            'k_top_creators': top_creators_list,
            'k_top_products': top_products_list,
            'k_top_videos': top_videos_list,
            'k_day_sales': top_store_sales_result['k_day_sales'],
            'k_day_revenue': top_store_sales_result['k_day_revenue'],
        }

        convex(data_map)
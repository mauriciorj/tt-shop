from top_creators.main import main as top_creators_main

from request_top_products_from_store_details import request_top_products_from_store_details
from request_top_products_from_store_details_dto import request_top_products_from_store_details_dto
from request_top_videos import request_top_videos
from request_top_videos_dto import request_top_videos_dto
from request_store_total_sales import request_store_total_sales
from request_store_total_sales_dto import request_store_total_sales_dto

from update_creators_db import update_creators_db
from update_videos_db import update_videos_db
from update_stores_db_from_store_details import update_stores_db_from_store_details

def request_control(driver, result_request_all_top_stores_from_db):
    print('[ SELENIUM ] Starting the requests...')

    for store in result_request_all_top_stores_from_db:
        store_id = store[0]

        # Top creators
        top_creators = top_creators_main(driver, store_id)


        # Request the list of the top products
        result_request_top_products = request_top_products_from_store_details(driver, store_id)
        if result_request_top_products['data'] is None:
            print('')
            print('[ SELENIUM ] result_request_top_products is None')
            return
        result_request_top_products_from_store_details_dto = request_top_products_from_store_details_dto(result_request_top_products)



        # Request the list of the top video
        result_request_top_videos = request_top_videos(driver, store_id)
        if result_request_top_videos['data'] is None:
            print('')
            print('[ SELENIUM ] result_request_top_videos is None')
            return
        result_request_top_videos_dto = request_top_videos_dto(result_request_top_videos)
        update_videos_db(result_request_top_videos_dto)



        # Request the total sales
        result_request_store_total_sales = request_store_total_sales(driver, store_id)
        if result_request_store_total_sales['data'] is None:
            print('')
            print('[ SELENIUM ] result_request_store_total_sales is None')
            return
        result_request_store_total_sales_dto = request_store_total_sales_dto(result_request_store_total_sales)



        # NOTE: This data is coming from the Top Stores crawler
        # Request the history sales
        # result_request_store_history_sales = request_store_history_sales(driver, store_id)
        # if result_request_store_history_sales['data'] is None:
        #     print('')
        #     print('[ SELENIUM ] result_request_store_history_sales is None')
        #     return



        # NOTE: This data is coming from the Top Stores crawler
        # Request the details of the store_id
        # result_request_store_details = request_store_details(driver, store_id)
        # if result_request_store_details['data'] is None:
        #     print('')
        #     print('[ SELENIUM ] result_request_store_details is None')
        #     return


        update_stores_db_from_store_details(store_id, top_creators, result_request_top_products_from_store_details_dto, result_request_top_videos_dto, result_request_store_total_sales_dto)
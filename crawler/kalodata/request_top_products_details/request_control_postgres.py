from top_creators_postgres.request_top_creators import request_top_creators
from top_creators_postgres.request_top_creators_dto import request_top_creators_dto
# from request_top_products_from_store_details import request_top_products_from_store_details
# from request_top_products_from_store_details_dto import request_top_products_from_store_details_dto
# from request_top_videos import request_top_videos
# from request_top_videos_dto import request_top_videos_dto
# from request_store_total_sales import request_store_total_sales
# from request_store_total_sales_dto import request_store_total_sales_dto

from request_top_creators.update_creators_db import update_creators_db
# from update_videos_db import update_videos_db
# from update_stores_db_from_store_details import update_stores_db_from_store_details

def request_control_postgres(driver, result_request_all_top_products_from_db):
    # print('[ SELENIUM ] Requesting product by product...')

    for product_id in result_request_all_top_products_from_db:
        # Request the list of the top creators
        result_request_top_creators = request_top_creators(driver, product_id[0])
        if result_request_top_creators['data'] is None:
            print('')
            print('[ SELENIUM ] result_request_top_creators is None')
            return
        result_request_top_creators_dto = request_top_creators_dto(product_id[0], result_request_top_creators)
        update_creators_db(result_request_top_creators_dto)



        # Request the list of the top products
        result_request_top_products = request_top_products_from_store_details(driver, product_id[0])
        if result_request_top_products['data'] is None:
            print('')
            print('[ SELENIUM ] result_request_top_products is None')
            return
        result_request_top_products_from_store_details_dto = request_top_products_from_store_details_dto(result_request_top_products)



        # Request the list of the top video
        result_request_top_videos = request_top_videos(driver, product_id[0])
        if result_request_top_videos['data'] is None:
            print('')
            print('[ SELENIUM ] result_request_top_videos is None')
            return
        result_request_top_videos_dto = request_top_videos_dto(result_request_top_videos)
        update_videos_db(result_request_top_videos_dto)



        # Request the total sales
        result_request_store_total_sales = request_store_total_sales(driver, product_id[0])
        if result_request_store_total_sales['data'] is None:
            print('')
            print('[ SELENIUM ] result_request_store_total_sales is None')
            return
        result_request_store_total_sales_dto = request_store_total_sales_dto(result_request_store_total_sales)


        update_stores_db_from_store_details(product_id[0], result_request_top_creators_dto, result_request_top_products_from_store_details_dto, result_request_top_videos_dto, result_request_store_total_sales_dto)
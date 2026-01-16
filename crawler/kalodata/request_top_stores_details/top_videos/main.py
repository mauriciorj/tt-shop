from request_top_stores_details.top_videos.request_api import request_api
from request_top_stores_details.top_videos.request_api_dto import request_api_dto
from request_top_stores_details.top_videos.update_db import update_db

def main(driver, store_k_id): 
    # Request the list of the top video
    request_api_result = request_api(driver, store_k_id)
    
    if request_api_result['data'] is None:
        print('')
        print('[ SELENIUM ] request_api_result is None')
        return
    
    request_api_dto_result = request_api_dto(request_api_result)
    
    update_db(request_api_dto_result)
    
    return request_api_dto_result

if __name__ == "__main__":
    main()
import os
import json

from request_top_stores_details.top_videos_convex.request_api_dto import request_api_dto
from request_top_stores_details.top_videos_convex.update_db import update_db

def load_json():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'sample_shop-detail-searchVideos.json')
    if not os.path.exists(file_path):
        return None
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def main(store_k_id): 
    # Request the list of the top video
    request_api_result = load_json()
    
    if request_api_result['data'] is None:
        print('')
        print('[ SELENIUM ] request_api_result is None')
        return
    
    request_api_dto_result = request_api_dto(request_api_result)

    update_db(request_api_dto_result)
    
    return request_api_dto_result

if __name__ == "__main__":
    main()
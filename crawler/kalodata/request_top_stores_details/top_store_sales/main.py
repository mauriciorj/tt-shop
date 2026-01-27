import os
import json

from utils.save_json import save_json

from request_top_stores_details.top_store_sales.request.main import main as request_api
from request_top_stores_details.top_store_sales.request.dto import dto as request_api_dto

# def load_json():
#     current_dir = os.path.dirname(os.path.abspath(__file__))
#     file_path = os.path.join(current_dir, 'sample_shop-detail-total.json')
#     if not os.path.exists(file_path):
#         return None
#     with open(file_path, 'r', encoding='utf-8') as f:
#         data = json.load(f)
#     return data

def main(driver, store_k_id, page): 
    # STEP 01 - Request the store total sales
    request_api_result = request_api(driver, store_k_id)
    
    
    if request_api_result['data'] is None:
        print('')
        print('[ SELENIUM ] Request store total sales is None')
        return
    
    # STEP 03 - Save the response to a JSON file
    save_json(data=request_api_result, file_name=f'request_top_stores_details-top_store_sales_{page}.json')

    # STEP 04 - Convert the response to a DTO
    request_api_dto_result = request_api_dto(request_api_result)
    
    # STEP 05 - Return the response to correct database
    return request_api_dto_result

if __name__ == "__main__":
    main()
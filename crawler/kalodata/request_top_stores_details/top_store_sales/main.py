import os
import json

from utils.save_json import save_json

from request_top_stores_details.top_store_sales.request_api.main import main as request_api
from request_top_stores_details.top_store_sales.request_api.dto import dto as dto

# def load_json():
#     current_dir = os.path.dirname(os.path.abspath(__file__))
#     file_path = os.path.join(current_dir, 'sample_shop-detail-total.json')
#     if not os.path.exists(file_path):
#         return None
#     with open(file_path, 'r', encoding='utf-8') as f:
#         data = json.load(f)
#     return data

def main(driver, k_id, page, start_date, end_date):
    # STEP 01 - Request the store total sales
    request_api_result = request_api(driver, k_id, start_date, end_date)
    
    
    if request_api_result['data'] is None:
        print('')
        print('[ SELENIUM ] Request store total sales is None')
        return
    
    # STEP 03 - Save the response to a JSON file
    save_json(data=request_api_result, file_name=f'request_top_stores_details-top_store_sales_{page}.json')

    # STEP 04 - Convert the response to a DTO
    dto_result = dto(request_api_result)
    
    # STEP 05 - Return the response to correct database
    return dto_result

if __name__ == "__main__":
    main()
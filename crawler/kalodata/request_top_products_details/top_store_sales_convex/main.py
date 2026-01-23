import os
import json

from request_top_products_details.top_store_sales_convex.request_api_dto import request_api_dto

def load_json():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'product-detail-total.json')
    if not os.path.exists(file_path):
        return None
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def main(): 
    # Request the list of the top creators
    request_api_result = load_json()
    
    if request_api_result['data'] is None:
        print('')
        print('[ SELENIUM ] request_api_result is None')
        return

    request_api_dto_result = request_api_dto(request_api_result)

    return request_api_dto_result

if __name__ == "__main__":
    main()
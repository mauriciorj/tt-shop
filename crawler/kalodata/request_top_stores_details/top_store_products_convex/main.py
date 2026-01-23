import os
import json

from request_top_stores_details.top_store_products_convex.request_api_dto import request_api_dto

def load_json():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'sample_shop-detail-product-queryList.json')
    if not os.path.exists(file_path):
        return None
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def main(store_k_id): 
    # Request products details
    request_api_result = load_json()
    
    if request_api_result['data'] is None:
        return
    
    request_api_dto_result = request_api_dto(request_api_result)

    return request_api_dto_result


if __name__ == "__main__":
    main()
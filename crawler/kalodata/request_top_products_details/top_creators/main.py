import os
# import json

from utils.save_json import save_json

from request_top_products_details.top_creators.request_api.main import main as request_api
from request_top_products_details.top_creators.request_api.dto import dto as dto
from request_top_products_details.top_creators.convex.main import main as convex

# def load_json():
#     current_dir = os.path.dirname(os.path.abspath(__file__))
#     file_path = os.path.join(current_dir, 'product-detail-creator-queryList.json')
#     if not os.path.exists(file_path):
#         return None
#     with open(file_path, 'r', encoding='utf-8') as f:
#         data = json.load(f)
#     return data

def main(driver, k_id, page):
    print("")
    print('[ PRODUCTS DETAILS - TOP CREATORS ]')
    
    # STEP 01 - Request the list of the top creators
    request_api_result = request_api(driver, k_id)
    
    if request_api_result['data'] is None:
        print('')
        print('[ PRODUCTS DETAILS - TOP CREATORS ] Request top creators is None')
        return

    # STEP 03 - Save the response to a JSON file
    save_json(data=request_api_result, file_name=f'request_top_products_details-top_creators_{page}.json')

    # STEP 04 - Convert the response to a DTO
    dto_result = dto(request_api_result)
    
    # STEP 05 - Save the response to correct database
    convex(dto_result)

    # STEP 06 - Return the response to correct database
    return dto_result

if __name__ == "__main__":
    main()
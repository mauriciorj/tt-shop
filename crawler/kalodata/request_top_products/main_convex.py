import json
import os

from request_top_products.request_api import request_api
from request_top_products.request_api_dto import request_api_dto
from request_top_products.convex.main import main as db_handler

def load_json():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, 'sample.json')
    if not os.path.exists(file_path):
        return None
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def main(): 
    print('')
    print('[ SELENIUM ] Starting request_top_products...')
    print('[ SELENIUM ] Loading sample.json...')

    request_api_result = load_json()

    print('[ SELENIUM ] sample.json loaded successfully')

    if request_api_result['data'] is None:
        print('[ SELENIUM ] request_api_result is None')
        return

    request_api_dto_result = request_api_dto(request_api_result)

    db_handler(request_api_dto_result)
    
    print('[ SELENIUM ] Done !')
    print('')

if __name__ == "__main__":
    main()
# import json
import os

from login.main import main as login
from chrome.main import main as chrome

from utils.save_json import save_json

from request_categories.request_api.main import main as request_api
from request_categories.request_api.dto_only_main_category import dto as dto

from request_categories.convex.main import main as db_handler_convex
from request_categories.postgres.main import main as db_handler_postgres

# def load_json():
#     current_dir = os.path.dirname(os.path.abspath(__file__))
#     file_path = os.path.join(current_dir, 'sample.json')
#     if not os.path.exists(file_path):
#         return None
#     with open(file_path, 'r', encoding='utf-8') as f:
#         data = json.load(f)
#     return data

def main(type='convex'):
    driver = chrome()
    login(driver)

    request_api_result = request_api(driver)
    # request_api_result = load_json()

    if request_api_result['data'] is None:
        print(f'[ SELENIUM ] request_api_result is None {request_api_result}')
        return

    save_json(data=request_api_result, file_name='request_categories.json')

    dto_result = dto(request_api_result)

    if type == 'convex':
        db_handler_convex(dto_result)
    elif type == 'postgres':
        db_handler_postgres(dto_result)
    else:
        print('[ SELENIUM ] Invalid type')
        return

if __name__ == "__main__":
    main()
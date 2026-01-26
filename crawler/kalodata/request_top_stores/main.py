import json
import os

import time
import random

from login.main import main as login
from chrome.main import main as chrome

from utils.save_json import save_json

from request_top_stores.request_api.main import main as request_api
from request_top_stores.request_api.dto import dto as request_api_dto
from request_top_stores.convex.main import main as db_handler_convex
from request_top_stores.postgres.main import main as db_handler_postgres

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

    page = 1
    max_page = 10

    while page <= max_page:

        # STEP 01 - Request the top stores from API
        request_api_result = request_api(driver, page)

        if request_api_result['data'] is None:
            print(f'[ SELENIUM ] request_api_result is None {request_api_result}')
            return

        # STEP 02 - Save the response to a JSON file
        save_json(data=request_api_result, file_name=f'request_top_stores_{page}.json')

        # STEP 03 - Convert the response to a DTO
        request_api_dto_result = request_api_dto(request_api_result)

        # STEP 04 - Save the response to a database
        if type == 'convex':
            db_handler_convex(request_api_dto_result)
        elif type == 'postgres':
            db_handler_postgres(request_api_dto_result)
        else:
            print('[ SELENIUM ] Invalid type')
            return

        page += 1

        sleep_time = random.randint(1, 10)
        print(f"[ SELENIUM ] Sleeping for {sleep_time} seconds...")
        time.sleep(sleep_time)

if __name__ == "__main__":
    main()
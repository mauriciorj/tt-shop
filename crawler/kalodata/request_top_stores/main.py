# import json
import os

import time
import random

from login.main import main as login
from chrome.main import main as chrome

from utils.save_json import save_json

from request_top_stores.request_api.main import main as request_api
from request_top_stores.request_api.dto import dto as dto
from request_top_stores.convex.main import main as convex

# def load_json():
#     current_dir = os.path.dirname(os.path.abspath(__file__))
#     file_path = os.path.join(current_dir, 'sample.json')
#     if not os.path.exists(file_path):
#         return None
#     with open(file_path, 'r', encoding='utf-8') as f:
#         data = json.load(f)
#     return data

def main(start_date, end_date):
    driver = chrome()
    login(driver)

    page = 1
    max_page = 10

    while page <= max_page:
        print("")
        print("========================= TOP STORES =========================")
        print(f"[ SELENIUM ] Page {page}")

        # STEP 01 - Request the top stores from API
        request_api_result = request_api(driver, page, start_date, end_date)

        # STEP 02 - Check if the request was successful
        if request_api_result['data'] is None:
            print(f'[ SELENIUM ] request_api_result is None {request_api_result}')
            return

        # STEP 03 - Save the response to a JSON file
        save_json(data=request_api_result, file_name=f'request_top_stores_{page}.json')

        # STEP 04 - Convert the response to a DTO
        dto_result = dto(request_api_result)

        # STEP 05 - Save the response to correct database
        convex(dto_result)

        page += 1

        sleep_time = random.randint(1, 10)
        print(f"[ SELENIUM ] Sleeping for {sleep_time} seconds...")
        time.sleep(sleep_time)

if __name__ == "__main__":
    main()
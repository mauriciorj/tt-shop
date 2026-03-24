import os

import time
import random

from login.main import main as login
from chrome.main import main as chrome

from utils.save_json import save_json

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from utils.save_error import save_error

from request_video_details.handlers_control import handlers_control

def main(start_date, end_date):
    driver = chrome()
    login(driver)

    done = False
    cursor = None
    data = []
    num_items_per_page = 10

    # Used to save the JSON files
    page = 1

    while not done:
        print("")
        print("========================= VIDEO DETAILS =========================")
        print(f"[ SELENIUM ] Page {page}")

        try:
            client = ConvexClient(CONVEX_URL)

            request_db_result = None

            # STEP 01 - Request the top videos from database
            request_db_result = client.query("videos:getVideoByIdWithPagination", {'paginationOpts': { 'numItems': num_items_per_page, 'cursor': cursor }})
            
            # STEP 02 - Check if the request was successful
            if request_db_result is None or request_db_result['page'] is None:
                print('[ SELENIUM ] No more videos to process or error occurred.')
                break

            # STEP 03 - Save the response to a JSON file
            save_json(data=request_db_result, file_name=f'request_top_stores_details_{page}.json')
        
            # STEP 04 - Send the request result to handler
            handlers_control(driver, request_db_result['page'], start_date, end_date)

            # STEP 05 - Extract the page data, cursor, and completion status
            cursor = request_db_result['continueCursor']
            done = request_db_result["isDone"]
            data.extend(request_db_result['page'])
            page += 1

        except Exception as e:
            save_error(source='request_top_stores_details/main', error=e)


if __name__ == "__main__":
    main()
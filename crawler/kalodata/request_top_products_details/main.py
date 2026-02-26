import os

import time
import random

from login.main import main as login
from chrome.main import main as chrome

from utils.save_json import save_json

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from utils.save_error import save_error

from request_top_products_details.handlers_control import handlers_control

def main():
    driver = chrome()
    login(driver)

    done = False
    cursor = None
    data = []
    num_items_per_page = 5

    # Used to save the JSON files
    page = 1

    while not done:
        print("")
        print("========================= PRODUCTS DETAILS =========================")
        print(f"[ PRODUCTS DETAILS ] Page {page}")

        try:
            client = ConvexClient(CONVEX_URL)

            request_db_result = None

            # STEP 01 - Request the top stores from database
            request_db_result = client.query("products:getProductsWithId", {'paginationOpts': { 'numItems': num_items_per_page, 'cursor': cursor }})

            # STEP 02 - Check if the request was successful
            if request_db_result is None or request_db_result['page'] is None:
                print('[ PRODUCTS DETAILS ] No more stores to process or error occurred.')
                break

            # STEP 03 - Save the response to a JSON file
            save_json(data=request_db_result, file_name=f'request_top_products_details_{page}.json')

            # STEP 04 - Send the request result to handler
            handlers_control(driver, request_db_result['page'], page)
        
            # STEP 05 - Extract the page data, cursor, and completion status
            cursor = request_db_result['continueCursor']
            done = request_db_result["isDone"]
            data.extend(request_db_result['page'])
            page += 1

        except Exception as e:
            save_error(source='request_top_products_details-main', error=e)

if __name__ == "__main__":
    main()
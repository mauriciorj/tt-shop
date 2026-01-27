import json
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
# from logger.error import error

from logger.error import error
from request_top_products_details.handlers_control import handlers_control
from request_top_products_details.postgres import postgres_request

def main(type='convex'):
    driver = chrome()
    login(driver)

    # Used in case type == 'convex'
    done = False
    cursor = None
    data = []
    num_items_per_page = 5

    # Used in case type == 'postgres'
    limit = 10
    offset = 0

    # Used to save the JSON files
    page = 1

    while not done:
        print('')
        print(f"\n[ SELENIUM ] Fetching batch")

        try:
            client = ConvexClient(CONVEX_URL)

            request_db_result = None

            # STEP 01 - Request the top stores from database
            if type == 'convex':
                request_db_result = client.query("products:getProducts", {'paginationOpts': { 'numItems': num_items_per_page, 'cursor': cursor }})
            elif type == 'postgres':
                request_db_result = postgres_request(limit=limit, offset=offset)

            # STEP 02 - Check if the request was successful
            if type == 'convex' and (request_db_result is None or request_db_result['page'] is None):
                print('[ SELENIUM ] No more stores to process or error occurred.')
                break
            elif type == 'postgres' and request_db_result is None:
                print('[ SELENIUM ] No more stores to process or error occurred.')
                break

            # STEP 03 - Save the response to a JSON file
            save_json(data=request_db_result, file_name=f'request_top_products_details_{page}.json')

            # STEP 04 - Send the request result to handler
            handlers_control(driver, request_db_result['page'], type, page)
        
            # STEP 05 - Extract the page data, cursor, and completion status
            cursor = request_db_result['continueCursor']
            done = request_db_result["isDone"]
            data.extend(request_db_result['page'])
            offset += limit
            page += 1

        except Exception as e:
            error(f"[ SELENIUM ] Error fetching batch: {e}")
            break

if __name__ == "__main__":
    main()
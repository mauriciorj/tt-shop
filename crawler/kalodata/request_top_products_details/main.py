import os
import sys

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from logger.error import error
from request_top_products_details.request_control_convex import request_control_convex

def main(): 
    done = False
    cursor = None
    data = []
    num_items_per_page = 5

    while not done:
        print('')
        print(f"\n[ SELENIUM ] Fetching batch")

        try:
            client = ConvexClient(CONVEX_URL)

            request_db_result = client.query("products:getProducts", {'paginationOpts': { 'numItems': num_items_per_page, 'cursor': cursor }})
        except Exception as e:
            error(f"[ SELENIUM ] Error fetching batch: {e}")
            break

        if not request_db_result['page']:
            print('[ SELENIUM ] No more products to process or error occurred.')
            break

        request_control_convex(request_db_result['page'])
        
        # Extract the page data, cursor, and completion status
        cursor = request_db_result['continueCursor']
        done = request_db_result["isDone"]
        data.extend(request_db_result['page'])

if __name__ == "__main__":
    main()
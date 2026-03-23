import sys
import os

# getting the name of the directory
# where the this file is present.
current = os.path.dirname(os.path.realpath(__file__))

# Getting the parent directory name
# where the current directory is present.
parent = os.path.dirname(current)
parent_parent = os.path.dirname(parent)
parent_parent_parent = os.path.dirname(parent_parent)

# adding the parent directory to
# the sys.path.
sys.path.append(parent)
sys.path.append(parent_parent)
sys.path.append(parent_parent_parent)

from utils.save_error import save_error
from selenium_utils import selenium_fetch

def main(driver, id, start_date, end_date):
    print('[ PRODUCTS DETAILS - TOP PRODUCTS SALES REQUEST API ]')

    search_url = 'https://www.kalodata.com/product/detail/total'

    # Prepare the payload (same as before)
    body = {
        "id": id,
        "startDate": start_date,
        "endDate": end_date,
        "authority": True,
    }
    
    headers = {
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
        'country': 'BR',
        'currency': 'USD',
        'language': 'en-US',
        'origin': 'https://www.kalodata.com',
        'referer': 'https://www.kalodata.com/shop',
    }

    try:
        # Use our new helper function
        data = selenium_fetch(driver, search_url, method="POST", headers=headers, json_data=body)

        print('[ PRODUCTS DETAILS - TOP PRODUCTS SALES REQUEST API ] Request data done')
        return data

    except Exception as e:
        save_error(source='request_top_products_details-top_products_sales-request_api', error=e)


if __name__ == "__main__":
    main()
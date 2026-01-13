import sys
import os

# Adjust path to allow imports from crawler root
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current) # kalodata
parent_parent = os.path.dirname(parent) # selenium
parent_parent_parent = os.path.dirname(parent_parent) # crawler

# adding the parent directory to
# the sys.path.
sys.path.append(parent_parent_parent)

from selenium_utils import selenium_fetch

def request_top_products_from_store_details(driver, id):
    print('')
    print('[ SELENIUM ] Requesting top products...')

    search_url = 'https://www.kalodata.com/shop/detail/product/queryList'

    # Prepare the payload (same as before)
    body = {
        "id": id,
        "startDate": "2025-12-31",
        "endDate": "2026-01-06",
        "cateIds": [],
        "pageNo": 1,
        "pageSize": 10,
        "sort": [
            {
                "field": "revenue",
                "type": "DESC"
            }
        ],
        "productType": ""
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

        print('[ SELENIUM ] Request data done')
        return data

    except Exception as e:
        error_to_string = str(e)
        log_string = '['+ datetime.today().strftime('%Y-%m-%d %H:%M:%S') + '] ' + '[ SELENIUM - ERROR ] - ' + error_to_string
        print('')
        print('')
        print('')
        print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
        print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
        print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
        print(log_string)
        print('')
        print('')
        print('')
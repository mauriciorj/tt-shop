import sys
import os

# getting the name of the directory
# where the this file is present.
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current) # kalodata

# adding the parent directory to
# the sys.path.
sys.path.append(parent)

from selenium_utils import selenium_fetch

def request_top_stores(driver):
    print('')
    print('[ SELENIUM ] Requesting data...')

    search_url = 'https://www.kalodata.com/shop/queryList'

    # Prepare the payload (same as before)
    body = {
        "country": "BR",
        "startDate": "2025-12-06",
        "endDate": "2026-01-05",
        "cateIds": [],
        "showCateIds": [],
        "pageNo": 1,
        "pageSize": 10,
        "sort": [
            {
                "field": "revenue",
                "type": "DESC"
            }
        ]
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
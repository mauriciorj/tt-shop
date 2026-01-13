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

from selenium_utils import selenium_fetch

def request_store_total_sales(driver, id):
    print('')
    print('[ SELENIUM ] Requesting store total sales...')

    search_url = 'https://www.kalodata.com/shop/detail/total'

    # Prepare the payload (same as before)
    body = {
        "id": id,
        "startDate": "2025-12-31",
        "endDate": "2026-01-06",
        "cateIds": [],
        "historyStartDate": "2025-12-08",
        "historyEndDate": "2026-01-06"
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
        print(log_string)
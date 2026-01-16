import sys

from selenium_utils import selenium_fetch
from logger.error import error

def request_api(driver, store_k_id):
    print('')
    print('[ SELENIUM ] Requesting top products...')

    search_url = 'https://www.kalodata.com/shop/detail/product/queryList'

    # Prepare the payload (same as before)
    body = {
        "id": store_k_id,
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
        error(e, 14)
        sys.exit(1)
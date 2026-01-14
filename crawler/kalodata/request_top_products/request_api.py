import sys

from selenium_utils import selenium_fetch
from logger.error import error

def request_api(driver, page):
    print('')
    print('[ SELENIUM ] Requesting data...')

    search_url = 'https://www.kalodata.com/product/queryList'

    # Prepare the payload (same as before)
    body = {
        "country": "BR",
        "startDate": "2025-12-06",
        "endDate": "2026-01-05",
        "cateIds": [],
        "showCateIds": [],
        "pageNo": page,
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
        error(e)
        sys.exit(1)
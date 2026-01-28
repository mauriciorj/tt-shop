import sys

from selenium_utils import selenium_fetch
from utils.save_error import save_error

def main(driver, id):
    print('')
    print('[ SELENIUM ] Requesting top creators...')

    search_url = 'https://www.kalodata.com/shop/detail/searchCooperativeCreators'

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
        "creatorType": ""
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
        save_error(source='request_top_products_details/top_videos/request/main', error=e)

if __name__ == "__main__":
    main()

import sys

from selenium_utils import selenium_fetch
from utils.save_error import save_error

def main(driver, id):
    print('[ PRODUCTS DETAILS - TOP CREATORS REQUEST API ]')

    search_url = 'https://www.kalodata.com/product/detail/creator/queryList'

    # Prepare the payload (same as before)
    body = {
        "id": id,
        "startDate": "2026-01-25",
        "endDate": "2026-02-23",
        "cateIds": [],
        "pageNo": 1,
        "pageSize": 10,
        "sort": [
            {
                "field": "revenue",
                "type": "DESC"
            }
        ],
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

        print('[ PRODUCTS DETAILS - TOP CREATORS REQUEST API ] Request data done')
        return data

    except Exception as e:
        save_error(source='request_top_products_details-top_creators-request_api', error=e)


if __name__ == "__main__":
    main()
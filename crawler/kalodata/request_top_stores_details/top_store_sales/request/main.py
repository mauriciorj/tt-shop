import sys

from selenium_utils import selenium_fetch
from logger.error import error

def main(driver, store_k_id):
    print('')
    print('[ SELENIUM ] Requesting store total sales...')

    search_url = 'https://www.kalodata.com/shop/detail/total'

    # Prepare the payload (same as before)
    body = {
        "id": store_k_id,
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
        error(e, 11)
        sys.exit(1)

if __name__ == "__main__":
    main()

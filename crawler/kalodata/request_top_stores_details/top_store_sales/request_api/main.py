import sys

from selenium_utils import selenium_fetch
from utils.save_error import save_error

def main(driver, id):
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
        save_error(source='request_top_stores_details/top_store_sales/request/main', error=e)

if __name__ == "__main__":
    main()

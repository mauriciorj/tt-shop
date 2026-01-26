import sys

from selenium_utils import selenium_fetch
from utils.save_error import save_error
# from logger.error import error

def main(driver):
    print('')
    print('[ SELENIUM ] Requesting data...')

    search_url = 'https://www.kalodata.com/api/configurations'

    # Prepare the payload (same as before)
    body = [
        {
            "key": "global.category.tree"
        }
    ]
    
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
        save_error(source='categories/request_api', error=e)
        # error(e, 5)
        sys.exit(1)


if __name__ == "__main__":
    main()
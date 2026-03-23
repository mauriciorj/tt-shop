from selenium_utils import selenium_fetch
from utils.save_error import save_error

def main(driver, page, start_date, end_date):
    print('')
    print('[ SELENIUM ] Requesting data...')

    search_url = 'https://www.kalodata.com/video/queryList'

    # Prepare the payload (same as before)
    body = {
        "country": "BR",
        "startDate": start_date,
        "endDate": end_date,
        "cateIds": [],
        "showCateIds": [],
        "pageNo": page,
        "pageSize": 10,
        "sort": [
            {
                "field": "revenue",
                "type": "DESC"
            }
        ],
        "video.filter.video_type":"WithProduct",
        "video.filter.ad.daily_roas":""
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
        save_error(source='request_top_stores/request_api/main', error=e)

    if __name__ == "__main__":
        main()
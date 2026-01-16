import time
import random

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from login.login import login
from request_top_stores_details.request_db import request_db
from request_top_stores_details.request_control import request_control

# UC automatically handles most anti-detection, but setting a specific user-agent is still good practice.
user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
chrome_options = uc.ChromeOptions()
chrome_options.add_argument(f'user-agent={user_agent}')
chrome_options.add_argument("lang=en-US,en")
# chrome_options.add_argument("--headless")

def main(): 
    driver = uc.Chrome(options=chrome_options)

    login(driver)

    limit = 10
    offset = 0

    while True:
        print('')
        print(f"\n[ SELENIUM ] Fetching batch with limit={limit}, offset={offset}")
        request_db_result = request_db(limit=limit, offset=offset)

        if not request_db_result:
            print('[ SELENIUM ] No more stores to process or error occurred.')
            break

        request_control(driver, request_db_result)
        
        offset += limit
        
        sleep_time = random.randint(1, 10)
        print(f"[ SELENIUM ] Sleeping for {sleep_time} seconds...")
        time.sleep(sleep_time)

if __name__ == "__main__":
    main()
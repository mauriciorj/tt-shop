import sys
import os
import time
import random

# getting the name of the directory
# where the this file is present.
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current) # kalodata

# adding the parent directory to
# the sys.path.
sys.path.append(parent)

from dotenv import load_dotenv

load_dotenv()

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from login.login import login
from request_all_top_products_from_db_postgres import request_all_top_products_from_db_postgres
from request_control_postgres import request_control_postgres

# UC automatically handles most anti-detection, but setting a specific user-agent is still good practice.
user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
chrome_options = uc.ChromeOptions()
chrome_options.add_argument(f'user-agent={user_agent}')
chrome_options.add_argument("lang=en-US,en")
# chrome_options.add_argument("--headless")

driver = uc.Chrome(options=chrome_options)


def main(): 
    login(driver)

    limit = 10
    offset = 0

    while True:
        print(f"\n[ SELENIUM ] Fetching batch with limit={limit}, offset={offset}")
        result_request_all_top_products_from_db_postgres = request_all_top_products_from_db_postgres(limit=limit, offset=offset)

        if not result_request_all_top_products_from_db_postgres:
            print('[ SELENIUM ] No more products to process or error occurred.')
            break

        request_control_postgres(driver, result_request_all_top_products_from_db_postgres)
        
        offset += limit
        
        sleep_time = random.randint(1, 10)
        print(f"[ SELENIUM ] Sleeping for {sleep_time} seconds...")
        time.sleep(sleep_time)

if __name__ == "__main__":
    main()
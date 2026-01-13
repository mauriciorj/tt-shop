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

from login import login
from request_top_products import request_top_products
from request_top_products_dto import request_top_products_dto
from update_products_db import update_products_db

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

        result_request_top_products = request_top_products(driver)

        if result_request_top_products['data'] is None:
            print('[ SELENIUM ] result_request_top_products is None')
            return

        result_request_top_products_dto = request_top_products_dto(result_request_top_products)

        update_products_db(result_request_top_products_dto)

        offset += limit

        sleep_time = random.randint(1, 10)
        print(f"[ SELENIUM ] Sleeping for {sleep_time} seconds...")
        time.sleep(sleep_time)

if __name__ == "__main__":
    main()
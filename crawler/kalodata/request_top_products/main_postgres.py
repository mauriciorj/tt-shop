import time
import random
import json
import os

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# UC automatically handles most anti-detection, but setting a specific user-agent is still good practice.
user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
chrome_options = uc.ChromeOptions()
chrome_options.add_argument(f'user-agent={user_agent}')
chrome_options.add_argument("lang=en-US,en")
# chrome_options.add_argument("--headless")

from login.login import login
from request_top_products.request_api import request_api
from request_top_products.request_api_dto import request_api_dto
from request_top_products.postgres.main import main as db_handler
from utils.save_json import save_json
from utils.load_json import load_json


def main(): 
    driver = uc.Chrome(options=chrome_options)
    
    login(driver)

    page = 1

    while True:
        print('')
        print(f"\n[ SELENIUM ] Fetching batch with page={page}")

        # In case need to load data from request_api_result json file
        # request_api_result = load_json(page)

        request_api_result = request_api(driver, page)

        if request_api_result['data'] is None:
            print('[ SELENIUM ] request_api_result is None')
            return

        # In case need to save the data from request_api_result to json file
        # save_json(request_api_result, page)

        request_api_dto_result = request_api_dto(request_api_result)

        db_handler(request_api_dto_result)

        page += 1

        sleep_time = random.randint(1, 10)
        print('')
        print(f"[ SELENIUM ] Sleeping for {sleep_time} seconds...")
        time.sleep(sleep_time)

if __name__ == "__main__":
    main()
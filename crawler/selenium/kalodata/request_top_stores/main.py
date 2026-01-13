import sys
import os

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
from request_top_stores import request_top_stores
from request_top_stores_dto import request_top_stores_dto
from update_stores_db import update_stores_db

# UC automatically handles most anti-detection, but setting a specific user-agent is still good practice.
user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
chrome_options = uc.ChromeOptions()
chrome_options.add_argument(f'user-agent={user_agent}')
chrome_options.add_argument("lang=en-US,en")
# chrome_options.add_argument("--headless")

driver = uc.Chrome(options=chrome_options)

def main(): 
    login(driver)

    result_request_top_stores = request_top_stores(driver)

    if result_request_top_stores['data'] is None:
        print('')
        print('[ SELENIUM ] result_request_top_stores is None')
        return

    result_request_top_stores_dto = request_top_stores_dto(result_request_top_stores)

    update_stores_db(result_request_top_stores_dto)

if __name__ == "__main__":
    main()
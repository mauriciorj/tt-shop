import sys
import os

# getting the name of the directory
# where the this file is present.
current = os.path.dirname(os.path.realpath(__file__))

# Getting the parent directory name
# where the current directory is present.
parent = os.path.dirname(current)
parent_parent = os.path.dirname(parent)
parent_parent_parent = os.path.dirname(parent_parent)

# adding the parent directory to
# the sys.path.
sys.path.append(parent)
sys.path.append(parent_parent)
sys.path.append(parent_parent_parent)

from dotenv import load_dotenv

load_dotenv()

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from login import login
from request_top_products_data import request_top_products_data
from request_top_products_data_dto import request_top_products_data_dto
from request_top_products_data_to_db import request_top_products_data_to_db

# UC automatically handles most anti-detection, but setting a specific user-agent is still good practice.
user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
chrome_options = uc.ChromeOptions()
chrome_options.add_argument(f'user-agent={user_agent}')
chrome_options.add_argument("lang=en-US,en")
# chrome_options.add_argument("--headless")

driver = uc.Chrome(options=chrome_options)


def main(): 
    cookies_dict = login(driver)

    request_data_result = request_top_products_data(driver)

    if request_data_result['data'] is None:
        print('')
        print('[ SELENIUM ] request_data_result is None')
        return

    formated_data = request_top_products_data_dto(request_data_result)

    result = request_top_products_data_to_db(formated_data)

if __name__ == "__main__":
    main()
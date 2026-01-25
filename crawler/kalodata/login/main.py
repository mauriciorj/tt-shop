import os

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def main(driver):
    url = "https://www.kalodata.com/login"

    print('')
    print('[ SELENIUM ] Trying to login...')

    # Open the web page
    driver.get(url)
    WebDriverWait(driver, 10)

    username = driver.find_element(By.ID, "register_email")
    password = driver.find_element(By.ID, "register_password")

    username.send_keys(os.getenv('KALODATA_USER'))
    password.send_keys(os.getenv('KALODATA_PASSWORD'))

    loginBtn = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
    loginBtn.click()

    WebDriverWait(driver, 10000).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div[class="bg-kalo-page  relative"]')))

    # token = driver.execute_script("return window.localStorage.getItem('token')")

    all_cookies= driver.get_cookies()
    cookies_dict = {}
    for cookie in all_cookies:
        cookies_dict[cookie['name']] = cookie['value']

    print('[ SELENIUM ] Login Done')
    return cookies_dict

if __name__ == "__main__":
    main()
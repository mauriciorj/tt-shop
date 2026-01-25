import json
import os

from login.main import main as login
from chrome.main import main as chrome

from utils.save_json import save_json

from request_categories.request_api.main import main as request_api
from request_categories.request_api.dto import dto as request_api_result_dto

from request_categories.database_convex.main import main as db_handler_convex
from request_categories.database_postgres.main import main as db_handler_postgres

def main(type='convex'):
    driver = chrome()
    login(driver)

    request_api_result = request_api(driver)

    save_json(data=request_api_result, file_name='request_categories.json')
    
    if request_api_result['data'] is None:
        print('[ SELENIUM ] request_api_result is None')
        return

    request_api_result_dto_result = request_api_result_dto(request_api_result)

    if type == 'convex':
        db_handler_convex(request_api_result_dto_result)
    elif type == 'postgres':
        db_handler_postgres(request_api_result_dto_result)
    else:
        print('[ SELENIUM ] Invalid type')
        return

if __name__ == "__main__":
    main()
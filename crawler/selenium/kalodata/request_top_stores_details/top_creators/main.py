from request_api import request_api

def main(driver, store_id): 
    # Request the list of the top creators
    result_request_top_creators = request_api(driver, store_id)
    if result_request_top_creators['data'] is None:
        print('')
        print('[ SELENIUM ] result_request_top_creators is None')
        return

    result_request_top_creators_dto = request_top_creators_dto(result_request_top_creators)
    update_creators_db(result_request_top_creators_dto)

    return result_request_top_creators_dto

if __name__ == "__main__":
    main()
from request_video_details.request_api.main import main as request_api
from request_video_details.request_api.dto import dto

from request_video_details.convex import convex


def handlers_control(driver, data):
    print('[ SELENIUM ] Starting the requests...')

    for store in data:
        id = store['_id']
        k_id = store['k_id']

        # Video details
        video_details_result = request_api(driver, k_id)
        dto_result = dto(video_details_result)


        # Common data for both tables
        data_map = {
            'id': id,
            'k_id': k_id,
            'main_category': dto_result,
        }

        convex(data_map)
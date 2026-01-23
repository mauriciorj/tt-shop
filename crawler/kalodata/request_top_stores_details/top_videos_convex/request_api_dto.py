from utils.parse_value import parse_value

def request_api_dto(result_request_top_videos):
    formated_data =  []

    for data in result_request_top_videos['data']:
        formated_data.append({
            'k_id': data['id'],
            'tt_account': data['handle'],
            'description': data['description'],
            'views': int(parse_value(data['views'])),
            'duration': data['duration'],
            'k_revenue': parse_value(data['revenue']),
            'k_sales': int(parse_value(data['sale'])),
        })
    return formated_data
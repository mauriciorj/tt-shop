from utils.parse_value import parse_value

def request_api_dto(request_api_result):
    formated_data =  []
    for data in request_api_result['data']:
        
        formated_data.append({
            'k_id': data['id'],
            'tt_account': data['handle'],
            'tt_nickname': data['nickname'],
            'tt_followers': int(data['followers']),
            'k_revenue': parse_value(data['revenue']),
            'k_video_revenue': parse_value(data['video_revenue']),
            'k_live_revenue': parse_value(data['live_revenue']),
            
        })
    return formated_data
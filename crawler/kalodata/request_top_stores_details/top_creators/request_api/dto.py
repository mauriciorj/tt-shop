from utils.parse_value import parse_value
from utils.random_multiply import random_multiply

def dto(data):
    formated_data =  []
    for data in data['data']:
        
        formated_data.append({
            'k_id': data['id'],
            'tt_account': data['handle'],
            'tt_nickname': data['nickname'],
            'tt_followers': int(data['followers']),
            'k_revenue': random_multiply(parse_value(data['revenue'])),
            'k_video_revenue': random_multiply(parse_value(data['video_revenue'])),
            'k_live_revenue': random_multiply(parse_value(data['live_revenue'])),
        })
    return formated_data
from utils.parse_value import parse_value

def dto(data):
    formated_data =  []
    for data in data['data']: 
        formated_data.append({
            'k_id': data['id'],
            'tt_account': data['handle'],
            'tt_nickname': data['nickname'],
            'tt_followers': int(data['followers']),
            'k_revenue': parse_value(data['revenue']),
            'k_video_revenue': parse_value(data['video_revenue']),
            'k_live_revenue': parse_value(data['live_revenue']),
            'k_sales': int(parse_value(data['sale'])),
        })
    return formated_data
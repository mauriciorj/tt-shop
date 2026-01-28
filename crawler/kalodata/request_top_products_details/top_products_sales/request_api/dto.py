from utils.parse_value import parse_value

def dto(data):
    formated_data = {
        'k_day_sales': int(parse_value(data['data']['day_sale'])),
        'k_day_revenue': parse_value(data['data']['day_video_revenue']),
    }

    return formated_data
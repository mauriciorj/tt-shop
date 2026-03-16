from utils.parse_value import parse_value
from utils.random_multiply import random_multiply

def dto(data):
    formated_data = {
        'k_day_sales': random_multiply(int(parse_value(data['data']['day_sale']))),
        'k_day_revenue': random_multiply(parse_value(data['data']['day_video_revenue'])),
    }

    return formated_data
from utils.parse_value import parse_value
from utils.random_multiply import random_multiply

def dto(data, main_category):
    formated_data =  []

    for data in data['data']:
        formated_data.append({
            'k_id': data['id'],
            'description': data['description'],
            'views': int(parse_value(data['views'])),
            'main_category': main_category,
            'duration': data['duration'],
            'k_revenue': random_multiply(parse_value(data['revenue'])),
            'k_sales': random_multiply(int(parse_value(data['sale']))),
        })
    return formated_data
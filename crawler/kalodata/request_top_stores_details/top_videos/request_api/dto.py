from utils.parse_value import parse_value

def dto(data, main_category):
    formated_data =  []

    for data in data['data']:
        formated_data.append({
            'k_id': data['id'],
            'tt_account': data['handle'],
            'description': data['description'],
            'views': int(parse_value(data['views'])),
            'main_category': main_category,
            'duration': data['duration'],
            'k_revenue': parse_value(data['revenue']),
            'k_sales': int(parse_value(data['sale'])),
        })
    return formated_data
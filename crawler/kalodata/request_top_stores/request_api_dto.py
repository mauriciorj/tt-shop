from utils.parse_value import parse_value
from utils.parse_categories import parse_categories

def request_api_dto(request_data_result):
    formated_data =  []
    for index, data in enumerate(request_data_result['data'], start=1):
        pri_cat, sec_cat, ter_cat = parse_categories(data.get('main_category'))
        
        formated_data.append({
            'name': data['name'],
            'country': "br",
            'type': data['seller_type'],
            'main_category': pri_cat,
            'second_category': sec_cat,
            'third_category': ter_cat,
            'unit_price': parse_value(data['unit_price']),
            'k_id': data['id'],
            'k_position': index,
            'k_revenue': parse_value(data['revenue']),
            'k_revenue_history': data['revenue_trend'],
            'k_revenue_growth_rate': parse_value(data['revenue_grouping_rate']),
            'k_sales': parse_value(data['sale']),
        })
    return formated_data
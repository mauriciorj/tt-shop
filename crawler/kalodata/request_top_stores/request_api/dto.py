from utils.normalize_url import normalize_url
from utils.parse_value import parse_value
from utils.parse_categories import parse_categories

def dto(data):
    print('')
    print('[ SELENIUM ] Formatting data...')
    formated_data =  []
    for data in data['data']:
        pri_cat, sec_cat, ter_cat = parse_categories(data.get('main_category'))

        revenue_trend_to_float = [round(float(value), 2) for value in data['revenue_trend']]
        
        formated_data.append({
            'name': data['name'],
            'name_url': normalize_url(data['product_title']),
            'country': "br",
            'type': data['seller_type'].lower(),
            'main_category': str(pri_cat),
            'second_category': str(sec_cat),
            'third_category': str(ter_cat),
            'unit_price': parse_value(data['unit_price']),
            'k_id': str(data['id']),
            'k_revenue': parse_value(data['revenue']),
            'k_revenue_history': revenue_trend_to_float,
            'k_revenue_growth_rate': parse_value(data['revenue_grouping_rate']),
            'k_sales': int(parse_value(data['sale'])),
        })
    print('[ SELENIUM ] Data formatted successfully')
    return formated_data
from utils.normalize_url import normalize_url
from utils.revenue_history_periods import revenue_history_periods
from utils.parse_value import parse_value

def dto(data):
    print('')
    print('[ SELENIUM ] Formatting data...')
    formated_data =  []
    for data in data['data']:

        revenue_history, revenue_history_14_days, revenue_history_7_days = revenue_history_periods(data['revenue_trend'])

        formated_data.append({
            'name': data['product_title'],
            'name_url': normalize_url(data['product_title']),
            'country': "br",
            'launch_date': data['launch_date'],
            'product_rating': data['product_rating'],
            'main_category': str(data['pri_cate_id']),
            'second_category': str(data['sec_cate_id']),
            'third_category': str(data['ter_cate_id']),
            'unit_price': parse_value(data['unit_price']),
            'k_id': str(data['id']),
            'k_creator_conversion_ratio': round(float(data['creator_conversion_ratio']), 2),
            'k_revenue': parse_value(data['revenue']),
            'k_revenue_history': revenue_history,
            'k_revenue_history_14_days': revenue_history_14_days,
            'k_revenue_history_7_days': revenue_history_7_days,
            'k_revenue_growth_rate': parse_value(data['revenue_grouping_rate']),
            'k_sales': int(parse_value(data['sale'])),
        })
    print('[ SELENIUM ] Data formatted successfully')
    return formated_data
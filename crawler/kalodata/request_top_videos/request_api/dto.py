from utils.normalize_url import normalize_url
from utils.revenue_history_periods_with_random_multiply import revenue_history_periods_with_random_multiply
from utils.parse_value import parse_value
from utils.parse_categories import parse_categories
from utils.random_multiply import random_multiply

def dto(data):
    print('')
    print('[ SELENIUM ] Formatting data...')
    formated_data =  []
    for data in data['data']:
        pri_cat, sec_cat, ter_cat = parse_categories(data.get('main_category'))

        revenue_history, revenue_history_14_days, revenue_history_7_days = revenue_history_periods_with_random_multiply(data['revenue_trend'])

        formated_data.append({
            'description': data['description'],
            'k_id': str(data['id']),
            'k_revenue': random_multiply(parse_value(data['revenue'])),
            'k_revenue_history': revenue_history,
            'k_revenue_history_7_days': revenue_history_7_days,
            'k_revenue_history_14_days': revenue_history_14_days,
            'k_revenue_growth_rate': random_multiply(parse_value(data['revenue_grouping_rate'])),
            'k_sales': random_multiply(int(parse_value(data['sale']))),
            'views': int(parse_value(data['views'])),
            'tt_account': data['handle'],
            'duration': data['duration'],
            'publish_date': data['publish_date'],
        })
    print('[ SELENIUM ] Data formatted successfully')
    return formated_data
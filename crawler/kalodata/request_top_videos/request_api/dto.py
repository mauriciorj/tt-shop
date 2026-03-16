from utils.normalize_url import normalize_url
from utils.revenue_history_periods import revenue_history_periods
from utils.parse_value import parse_value
from utils.parse_categories import parse_categories

def dto(data):
    print('')
    print('[ SELENIUM ] Formatting data...')
    formated_data =  []
    for data in data['data']:
        pri_cat, sec_cat, ter_cat = parse_categories(data.get('main_category'))

        revenue_history, revenue_history_14_days, revenue_history_7_days = revenue_history_periods(data['revenue_trend'])

        formated_data.append({
            'description': data['description'],
            'k_id': str(data['id']),
            'k_revenue': parse_value(data['revenue']),
            'k_revenue_history': revenue_history,
            'k_revenue_history_7_days': revenue_history_7_days,
            'k_revenue_history_14_days': revenue_history_14_days,
            'k_revenue_growth_rate': parse_value(data['revenue_grouping_rate']),
            'k_sales': int(parse_value(data['sale'])),
            'views': int(parse_value(data['views'])),
            'tt_account': data['handle'],
            'duration': data['duration'],
            'publish_date': data['publish_date'],
        })
    print('[ SELENIUM ] Data formatted successfully')
    return formated_data
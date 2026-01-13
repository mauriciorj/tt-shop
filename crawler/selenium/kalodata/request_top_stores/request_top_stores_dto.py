import sys
import os

# Adjust path to allow imports from crawler root
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current) # kalodata
parent_parent = os.path.dirname(parent) # selenium
parent_parent_parent = os.path.dirname(parent_parent) # crawler

# adding the parent directory to
# the sys.path.
sys.path.append(parent_parent_parent)

from utils.parse_value import parse_value
from utils.parse_categories import parse_categories

def request_top_stores_dto(request_data_result):
    print('')
    print('[ SELENIUM ] Formatting data...')
    formated_data =  []
    for index, data in enumerate(request_data_result['data'], start=1):
        pri_cat, sec_cat, ter_cat = parse_categories(data.get('main_category'))
        
        formated_data.append({
            'k_id': data['id'],
            'k_position': index,
            'main_category': pri_cat,
            'name': data['name'],
            'region': 'BR',
            'revenue': parse_value(data['revenue']),
            'revenue_growth_rate': parse_value(data['revenue_grouping_rate']),
            'revenue_history': data['revenue_trend'],
            'sales': parse_value(data['sale']),
            'second_category': sec_cat,
            'third_category': ter_cat,
            'type': data['seller_type'],
            'unit_price': parse_value(data['unit_price']),
        })
    print('[ SELENIUM ] Format data done')
    return formated_data
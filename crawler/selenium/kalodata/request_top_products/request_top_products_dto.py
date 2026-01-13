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

def request_top_products_dto(request_data_result):
    print('')
    print('[ SELENIUM ] Formatting data...')
    formated_data =  []
    for index, data in enumerate(request_data_result['data'], start=1):
        
        formated_data.append({
            'k_id': data['id'],
            'k_position': index,
            'name': data['product_title'],
            'launch_date': data['launch_date'],
            'product_rating': data['product_rating'],
            'main_category': data['pri_cate_id'],
            'second_category': data['sec_cate_id'],
            'third_category': data['ter_cate_id'],
            'creator_conversion_ratio': parse_value(data['creator_conversion_ratio']),
            'revenue': parse_value(data['revenue']),
            'revenue_growth_rate': parse_value(data['revenue_grouping_rate']),
            'revenue_history': data['revenue_trend'],
            'sales': data['sale'],
            'unit_price': parse_value(data['unit_price']),
        })
    print('[ SELENIUM ] Format data done')
    return formated_data
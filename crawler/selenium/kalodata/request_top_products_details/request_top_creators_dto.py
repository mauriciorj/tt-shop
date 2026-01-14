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

def request_top_creators_dto(product_id, result_request_top_creators):
    print('')
    print('[ SELENIUM ] Formatting data...')
    formated_data =  []
    for data in result_request_top_creators['data']:

        # Under the store page the creators shows the total revenue
        # The revenue per product will be get on request_each_top_product_details and stored in products table (top_creators)
        
        formated_data.append({
            'product_id': product_id,
            'k_id': data['id'], # used in products table
            'tt_account': data['handle'], # used in products table
            'tt_nickname': data['nickname'], # used in products table
            'tt_followers': data['followers'],
            'revenue': parse_value(data['revenue']), # used in products table
            'sales': parse_value(data['sale']), # used in products table
            
        })
    print('[ SELENIUM ] Format data done')
    return formated_data
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

def request_top_products_from_store_details_dto(result_request_top_products):
    print('')
    print('[ SELENIUM ] Formatting data...')
    
    formated_data =  []

    # Under the store page the creators shows the total revenue
    # The revenue per product will be get on request_each_top_product_details and stored in products table (top_creators)
    for data in result_request_top_products['data']:
        formated_data.append({
            'k_id': data['id'],
        })

    print('[ SELENIUM ] Format data done')
    return formated_data
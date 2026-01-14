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

def request_top_videos_dto(result_request_top_videos):
    print('')
    print('[ SELENIUM ] Formatting data...')
    
    formated_data =  []

    for data in result_request_top_videos['data']:
        formated_data.append({
            'k_id': data['id'],
            'tt_account': data['handle'],
            'description': data['description'],
            'views': parse_value(data['views']),
            'duration': data['duration'],
            'revenue': parse_value(data['revenue']),
            'sales': data['sale'],
        })

    print('[ SELENIUM ] Format data done')
    return formated_data
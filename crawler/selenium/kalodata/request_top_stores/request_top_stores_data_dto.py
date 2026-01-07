import json

def parse_value(value):
    if not isinstance(value, str):
        return value
        
    # Remove currency symbol and percentages
    clean_value = value.replace('$', '').replace('%', '')
    
    multiplier = 1
    if 'k' in clean_value.lower():
        multiplier = 1000
        clean_value = clean_value.lower().replace('k', '')
    elif 'm' in clean_value.lower():
        multiplier = 1000000
        clean_value = clean_value.lower().replace('m', '')
    elif 'b' in clean_value.lower():
        multiplier = 1000000000
        clean_value = clean_value.lower().replace('b', '')
        
    try:
        return float(clean_value) * multiplier
    except ValueError:
        return 0.0

def parse_categories(category_str):
    if not category_str or not isinstance(category_str, str):
        return None, None, None
    
    try:
        data = json.loads(category_str)
        
        def get_last_id(key):
            items = data.get(key, [])
            if items and isinstance(items, list):
                # Take the first item, split by '-', take the last part
                return items[0].split('-')[-1]
            return None

        pri = get_last_id('pri_main_category')
        sec = get_last_id('sec_main_category')
        ter = get_last_id('ter_main_category')
        
        return pri, sec, ter
    except (json.JSONDecodeError, AttributeError):
        return None, None, None

def request_top_stores_data_dto(request_data_result):
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
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

def request_top_products_data_dto(request_data_result):
    print('')
    print('[ SELENIUM ] Formatting data...')
    formated_data =  []
    for index, data in enumerate(request_data_result['data'], start=1):
        
        formated_data.append({
            'creator_conversion_ratio': parse_value(data['creator_conversion_ratio']),
            'k_id': data['id'],
            'k_position': index,
            'launch_date': data['launch_date'],
            'main_category': data['pri_cate_id'],
            'name': data['product_title'],
            'product_rating': data['product_rating'],
            'revenue': parse_value(data['revenue']),
            'revenue_growth_rate': parse_value(data['revenue_grouping_rate']),
            'revenue_history': data['revenue_trend'],
            'sales': data['sale'],
            'second_category': data['sec_cate_id'],
            'third_category': data['ter_cate_id'],
            'unit_price': parse_value(data['unit_price']),
        })
    print('[ SELENIUM ] Format data done')
    return formated_data
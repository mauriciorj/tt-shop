from utils.parse_value import parse_value

def request_api_dto(request_data_result):
    print('')
    print('[ SELENIUM ] Formatting data...')
    formated_data =  []
    for index, data in enumerate(request_data_result['data'], start=1):
        
        formated_data.append({
            'name': data['product_title'],
            'country': "br",
            'launch_date': data['launch_date'],
            'product_rating': data['product_rating'],
            'main_category': data['pri_cate_id'],
            'second_category': data['sec_cate_id'],
            'third_category': data['ter_cate_id'],
            'unit_price': parse_value(data['unit_price']),
            'k_id': data['id'],
            'k_position': index,
            'k_creator_conversion_ratio': parse_value(data['creator_conversion_ratio']),
            'k_revenue': parse_value(data['revenue']),
            'k_revenue_history': data['revenue_trend'],
            'k_revenue_growth_rate': parse_value(data['revenue_grouping_rate']),
            'k_sales': data['sale'],
        })
    print('[ SELENIUM ] Data formatted successfully')
    return formated_data
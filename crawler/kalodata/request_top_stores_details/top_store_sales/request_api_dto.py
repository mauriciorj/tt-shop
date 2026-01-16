from utils.parse_value import parse_value

def request_api_dto(result_request_top_products):
    formated_data = {
        'k_day_sales': parse_value(result_request_top_products['data']['day_sale']),
        'k_day_revenue': parse_value(result_request_top_products['data']['day_revenue']),
    }

    return formated_data
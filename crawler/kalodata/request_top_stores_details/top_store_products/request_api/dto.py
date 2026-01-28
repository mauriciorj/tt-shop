from utils.parse_value import parse_value

def dto(data):
    formated_data =  []

    # Under the store page the creators shows the total revenue
    # The revenue per product will be get on request_each_top_product_details and stored in products table (top_creators)
    for data in data['data']:
        formated_data.append({
            'k_id': data['id'],
        })
    return formated_data
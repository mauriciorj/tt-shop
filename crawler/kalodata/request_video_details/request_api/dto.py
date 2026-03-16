from utils.parse_value import parse_value

def dto(data):
    formated_data = {
        'main_category': str(data['pri_cate_id']),
    }

    return formated_data
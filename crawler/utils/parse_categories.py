import json

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
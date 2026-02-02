import json

def dto(data):
    categories = []
    
    root_tree = data['data']['global.category.tree']

    for main_cat in root_tree:
        main_id = main_cat.get('value')
        main_name = main_cat.get('label')
        
        if main_id is not None and main_name is not None:
            # Case: Level 1 only
            categories.append({
                "main_category_id": str(main_id),
                "main_category_name": str(main_name)
            })

    return categories

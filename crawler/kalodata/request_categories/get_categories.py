import json

def get_categories(file_path: str) -> list[dict]:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    categories = []
    
    # Access the root of the category tree
    # Based on sample.json, the path is data['data']['global.category.tree']
    # We should handle potential missing keys safely if possible, but strict pathing is fine for this specific task
    root_tree = data.get('data', {}).get('global.category.tree', [])

    for main_cat in root_tree:
        main_id = main_cat.get('value')
        main_name = main_cat.get('label')
        
        # If no children, allow adding just the main category? 
        # The prompt implies a flat table structure. 
        # Usually for flattened trees, we include the path.
        
        level2_children = main_cat.get('children', [])
        
        if not level2_children:
            # Case: Level 1 only
            categories.append({
                "main_category_id": main_id,
                "main_category_name": main_name,
                "second_category_id": None,
                "second_category_name": None,
                "third_category_id": None,
                "third_category_name": None
            })
            continue

        for second_cat in level2_children:
            second_id = second_cat.get('value')
            second_name = second_cat.get('label')
            
            level3_children = second_cat.get('children', [])
            
            if not level3_children:
                # Case: Level 1 -> Level 2 only
                categories.append({
                    "main_category_id": main_id,
                    "main_category_name": main_name,
                    "second_category_id": second_id,
                    "second_category_name": second_name,
                    "third_category_id": None,
                    "third_category_name": None
                })
                continue

            for third_cat in level3_children:
                third_id = third_cat.get('value')
                third_name = third_cat.get('label')
                
                # Case: Level 1 -> Level 2 -> Level 3
                categories.append({
                    "main_category_id": main_id,
                    "main_category_name": main_name,
                    "second_category_id": second_id,
                    "second_category_name": second_name,
                    "third_category_id": third_id,
                    "third_category_name": third_name
                })

    return categories

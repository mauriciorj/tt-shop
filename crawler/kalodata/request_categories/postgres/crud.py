from datetime import datetime

def map_data(item):
    data_mapped = {
                'main_category_id': item.get('main_category_id'),
                'main_category_name': item.get('main_category_name'),
                'second_category_id': item.get('second_category_id'),
                'second_category_name': item.get('second_category_name'),
                'third_category_id': item.get('third_category_id'),
                'third_category_name': item.get('third_category_name'),
                'updated_at': datetime.now()
            }
    return data_mapped

def select(cursor, main_category_id):
    cursor.execute("SELECT id FROM categories WHERE main_category_id = %s", (main_category_id,))
    select_category = cursor.fetchone()
    return select_category

def update(cursor, select_category, categories_columns, category_values):
    category_id = select_category[0]
    set_clause = ", ".join([f"{col} = %s" for col in categories_columns])
                
    update_values = category_values + [category_id]
                
    sql = f"UPDATE categories SET {set_clause} WHERE id = %s"

    cursor.execute(sql, update_values)

    return True

def insert(cursor, categories_columns, category_values):
    placeholders = ", ".join(["%s"] * len(categories_columns))
    col_names = ", ".join(categories_columns)
                
    sql = f"INSERT INTO categories ({col_names}) VALUES ({placeholders}) RETURNING id"

    cursor.execute(sql, category_values)
    category_id = cursor.fetchone()[0] 

    return category_id
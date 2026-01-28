from datetime import datetime

def map_data(item):
    data_mapped = {
                'name': item.get('name'),
                'country': "br",
                'type': item.get('type'),
                'main_category': item.get('main_category'),
                'second_category': item.get('second_category'),
                'third_category': item.get('third_category'),
                'unit_price': item.get('unit_price'),
                'k_id': item.get('k_id'),
                'k_revenue': item.get('revenue'),
                'k_revenue_history': item.get('revenue_history'),
                'k_revenue_growth_rate': item.get('revenue_growth_rate'),
                'k_sales': item.get('sales'),
                'updated_at': datetime.now()
            }
    return data_mapped

def select(cursor, k_id):
    cursor.execute("SELECT id FROM stores WHERE k_id = %s", (k_id,))
    select_store = cursor.fetchone()
    return select_store

def update(cursor, select_store, stores_columns, stores_values):
    store_id = select_store[0]
    set_clause = ", ".join([f"{col} = %s" for col in stores_columns])

    update_values = stores_values + [store_id]
                
    sql = f"UPDATE stores SET {set_clause} WHERE id = %s"
    cursor.execute(sql, update_values)

    return True

def insert(cursor, stores_columns, stores_values):
    placeholders = ", ".join(["%s"] * len(stores_columns))
    col_names = ", ".join(stores_columns)
                
    sql = f"INSERT INTO stores ({col_names}) VALUES ({placeholders}) RETURNING id"
    cursor.execute(sql, stores_values)
    store_id = cursor.fetchone()[0]

    return store_id
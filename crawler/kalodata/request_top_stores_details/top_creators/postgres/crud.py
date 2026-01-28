from datetime import datetime

def map_data(item):
    data_mapped = {
                'k_id': item.get('k_id'),
                'tt_account': item.get('tt_account'),
                'tt_nickname': item.get('tt_nickname'),
                'tt_followers': item.get('tt_followers'),
                'k_revenue': item.get('k_revenue'),
                'k_video_revenue': item.get('k_video_revenue'),
                'k_live_revenue': item.get('k_live_revenue'),
                'updated_at': datetime.now()
            }
    return data_mapped

def select(cursor, k_id):
    cursor.execute("SELECT id FROM creators WHERE k_id = %s", (k_id,))
    select_creator = cursor.fetchone()
    return select_creator

def update(cursor, select_creator, creators_columns, creator_values):
    creator_id = select_creator[0]
    set_clause = ", ".join([f"{col} = %s" for col in creators_columns])
    update_values = creator_values + [creator_id]
    
    sql = f"UPDATE creators SET {set_clause} WHERE id = %s"
    cursor.execute(sql, update_values)

    return True

def insert(cursor, creators_columns, creator_values):
    placeholders = ", ".join(["%s"] * len(creators_columns))
    col_names = ", ".join(creators_columns)
                
    sql = f"INSERT INTO creators ({col_names}) VALUES ({placeholders}) RETURNING id"
    cursor.execute(sql, creator_values)
    creator_id = cursor.fetchone()[0] 

    return creator_id
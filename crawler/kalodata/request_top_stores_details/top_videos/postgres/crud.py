from datetime import datetime
# from logger.console import console

def map_data(item):
    data_mapped = {
                'k_id': item.get('k_id'),
                'tt_account': item.get('tt_account'),
                'description': item.get('description'),
                'views': item.get('views'),
                'duration': item.get('duration'),
                'k_revenue': item.get('k_revenue'),
                'k_sales': item.get('k_sales'),
                'updated_at': datetime.now()
            }
    return data_mapped

def select(cursor, k_id):
    cursor.execute("SELECT id FROM videos WHERE k_id = %s", (k_id,))
    select_video = cursor.fetchone()
    return select_video

def update(cursor, select_video, video_columns, video_values):
    video_id = select_video[0]
    set_clause = ", ".join([f"{col} = %s" for col in video_columns])
    update_values = video_values + [video_id]
    
    sql = f"UPDATE videos SET {set_clause} WHERE id = %s"
    cursor.execute(sql, update_values)

    return True

def insert(cursor, video_columns, video_values):
    placeholders = ", ".join(["%s"] * len(video_columns))
    col_names = ", ".join(video_columns)

    sql = f"INSERT INTO videos ({col_names}) VALUES ({placeholders}) RETURNING id"
    cursor.execute(sql, video_values)
    video_id = cursor.fetchone()[0] 

    return video_id
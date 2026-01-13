import sys
import os

# Adjust path to allow imports from crawler root
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current) # kalodata
parent_parent = os.path.dirname(parent) # selenium
parent_parent_parent = os.path.dirname(parent_parent) # crawler

sys.path.append(parent_parent_parent)

from db.client import connect_to_database

def create_stores():
    print("[ SELENIUM ] Connecting to database...")
    conn = connect_to_database()
    if conn is None:
        print("[ SELENIUM ] Failed to connect to database.")
        return

    try:
        cursor = conn.cursor()
        
        sql_file_path = os.path.join(current, 'stores.sql')
        
        print(f"[ SELENIUM ] Reading SQL from {sql_file_path}...")
        with open(sql_file_path, 'r') as file:
            sql_command = file.read()
            
        print("[ SELENIUM ] Execution SQL command...")
        cursor.execute(sql_command)
        
        conn.commit()
        cursor.close()
        print("[ SELENIUM ] Table 'stores' created successfully.")
        
    except Exception as e:
        print('')
        print('')
        print('')
        print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
        print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
        print(f"[ !!!!!!!!!!!!!!!!!!!!!!!! SELENIUM - ERROR !!!!!!!!!!!!!!!!!!!!!!!! ]")
        print(f"Error creating table: {e}")
        print('')
        print('')
        print('')
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    create_stores()

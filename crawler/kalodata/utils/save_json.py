import json
import os

def save_json(data = None, file_name = ''):
    current = os.path.dirname(os.path.realpath(__file__))
    parent = os.path.dirname(current) # kalodata

    file_path = os.path.join(parent, 'logs', file_name)
    
    if not os.path.exists(os.path.dirname(file_path)):
        os.makedirs(os.path.dirname(file_path))

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    # print(f"[ SELENIUM ] Saved JSON to {file_path}")
import json
import os

def load_json(page):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, f'request_api_result_{page}.json')
    if not os.path.exists(file_path):
        print(f"[ SELENIUM ] JSON file {file_path} not found.")
        return None
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"[ SELENIUM ] Loaded JSON from {file_path}")
    return data

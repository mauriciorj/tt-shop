import os
import shutil

def delete_images():
    current = os.path.dirname(os.path.realpath(__file__))
    kalodata_dir = os.path.dirname(current)
    crawler_dir = os.path.dirname(kalodata_dir)
    folder = os.path.join(crawler_dir, 'images')

    if not os.path.exists(folder):
        print(f"[ SELENIUM ] Folder {folder} does not exist.")
        return

    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f'[ SELENIUM ] Failed to delete {file_path}. Reason: {e}')
    
    print(f"[ SELENIUM ] All images deleted from {folder}")

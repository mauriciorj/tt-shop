import sys

from PIL import Image, ImageChops

from utils.save_error import save_error
# from logger.error import error

def compare_images(image1, image2):
    try:
        img1 = Image.open(image1).convert('RGB')
        img2 = Image.open(image2).convert('RGB')

        if img1.size != img2.size:
            return False
        
        diff = ImageChops.difference(img1, img2)
        
        # If getbbox() returns None, the images are identical
        if diff.getbbox():
            return False  # Images are different
        else:
            return True   # Images are the same
    except Exception as e:
        save_error(source=f'{k_id}-{id}-{type}/compare_images', error=e)
        # error(e, 111)
        sys.exit(1)
import os

from utils.save_error import save_error

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

def main(data):
    print("")
    print("[ CONVEX ] Adding / Updating categories...")

    try:
        client = ConvexClient(CONVEX_URL)

        print(f"[ CONVEX ] Total categories: {len(data)}")
        
        for item in data:
            client.mutation("categories:addCategory", item)

        print("[ CONVEX ] Categories added / updated successfully")
        print("")

    except Exception as e:
        save_error(source='request_categories/convex/main', error=e)

if __name__ == "__main__":
    main()
import os
import sys

from utils.save_error import save_error

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")


def main(formated_data):
    print("")
    print("[ CONVEX ] Adding / Updating categories...")

    try:
        client = ConvexClient(CONVEX_URL)

        print(f"[ CONVEX ] Total categories: {len(formated_data)}")
        
        for item in formated_data:
            client.mutation("categories:addCategory", {'data': item})

        print("[ CONVEX ] Categories added / updated successfully")
        print("")

    except Exception as e:
        save_error(source='request_categories/convex/main', error=e)
        sys.exit(1)

if __name__ == "__main__":
    main()
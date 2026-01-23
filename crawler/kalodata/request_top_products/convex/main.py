import os
import sys

from convex import ConvexClient
from dotenv import load_dotenv

load_dotenv(".env.local")
CONVEX_URL = os.getenv("NEXT_PUBLIC_CONVEX_URL")

from logger.error import error

def main(formated_data):
    print("")
    print("[ CONVEX ] Adding / Updating products...")

    try:
        client = ConvexClient(CONVEX_URL)
        
        for item in formated_data:
            client.mutation("products:addProduct", {'data': item})

        print("[ CONVEX ] Products added / updated successfully")
        print("")

    except Exception as e:
        error(e, 8)
        sys.exit(1)

if __name__ == "__main__":
    main()
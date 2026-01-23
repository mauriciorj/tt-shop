from simple_term_menu import TerminalMenu

from postgres_tables.create_categories import create_categories
from postgres_tables.create_creators import create_creators
from postgres_tables.create_products import create_products
from postgres_tables.create_stores import create_stores
from postgres_tables.create_videos import create_videos


# POSTGRES
from request_categories.main_postgres import main as run_request_categories_postgres
from request_top_stores.main_postgres import main as run_request_top_stores_postgres
from request_top_stores_details.main_postgres import main as run_request_top_stores_details_postgres
from request_top_products.main_postgres import main as run_request_top_products_postgres
# from request_top_products_details.main import main as run_request_top_products_details

# CONVEX
from request_top_stores.main_convex import main as run_request_top_stores_convex
from request_top_stores_details.main_convex import main as run_request_top_stores_details_convex
from request_top_products.main_convex import main as run_request_top_products_convext
from request_top_products_details.main_convex import main as run_request_top_products_details_convex

def create_tables_menu():
    options = [" > Categories", " > Creators", " > Products", " > Stores", " > Videos", "  << Return", "   * Quit"]
    terminal_menu = TerminalMenu(options, title="Select an option")
    menu_entry_index = terminal_menu.show()
    
    selection = options[menu_entry_index]
    print(f"You selected: {selection}")

    if selection == options[6]:
        print("Exiting...")
    elif selection == options[5]:
        main()
    elif selection == options[0]:
        create_categories()
    elif selection == options[1]:
        create_creators()
    elif selection == options[2]:
        create_products()
    elif selection == options[3]:
        create_stores()
    elif selection == options[4]:
        create_videos()

def run_crawler_postgres_menu():
    options = [" > [POSTGRES] Categories", " > [POSTGRES] Top Stores", "  > [POSTGRES] Top Stores Details", " > [POSTGRES] Top Products", "   << Return", "   <<< Quit"]
    terminal_menu = TerminalMenu(options, title="Select an option")
    menu_entry_index = terminal_menu.show()
    
    selection = options[menu_entry_index]
    print(f"You selected: {selection}")

    if selection == options[5]:
        print("Exiting...")
    elif selection == options[4]:
        main()
    elif selection == options[0]:
        run_request_categories_postgres()
    elif selection == options[1]:
        run_request_top_stores_postgres()
    elif selection == options[2]:
        run_request_top_stores_details_postgres()
    elif selection == options[3]:
        run_request_top_products_postgres()
    # elif selection == "Top Products Details":
    #     run_request_top_products_details()


def run_crawler_convext_menu():
    options = [" > [CONVEX] Top Stores", "  > [CONVEX] Top Stores Details", " > [CONVEX] Top Products", "  > [CONVEX] Top Products Details", "   << Return", "   <<< Quit"]
    terminal_menu = TerminalMenu(options, title="Select an option")
    menu_entry_index = terminal_menu.show()
    
    selection = options[menu_entry_index]
    print(f"You selected: {selection}")

    if selection == options[5]:
        print("Exiting...")
    elif selection == options[4]:
        main()
    elif selection == options[0]:
        run_request_top_stores_convex()
    elif selection == options[1]:
        run_request_top_stores_details_convex()
    elif selection == options[2]:
        run_request_top_products_convext()
    elif selection == options[3]:
        run_request_top_products_details_convex()

def main(): 
    options = ["Create Tables", "Run Crawler Postgres", "Run Crawler Convex", " * Quit"]
    terminal_menu = TerminalMenu(options, title="Select an option")
    menu_entry_index = terminal_menu.show()
    selection = options[menu_entry_index]
    print(f"You selected: {selection}")

    if selection == options[3]:
        print("Exiting...")
    elif selection == options[0]:
        create_tables_menu()
    elif selection == options[1]:
        run_crawler_postgres_menu()
    elif selection == options[2]:
        run_crawler_convext_menu()

if __name__ == "__main__":
    main()
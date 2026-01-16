from simple_term_menu import TerminalMenu

from postgres_tables.create_creators import create_creators
from postgres_tables.create_products import create_products
from postgres_tables.create_stores import create_stores
from postgres_tables.create_videos import create_videos

from request_top_stores.main import main as run_request_top_stores
from request_top_stores_details.main import main as run_request_top_stores_details
from request_top_products.main import main as run_request_top_products
# from request_top_products_details.main import main as run_request_top_products_details

def create_tables_menu():
    options = [" > Creators", " > Products", " > Stores", " > Videos", " > Quit"]
    terminal_menu = TerminalMenu(options, title="Select an option")
    menu_entry_index = terminal_menu.show()
    
    selection = options[menu_entry_index]
    print(f"You selected: {selection}")

    if selection == "Quit":
        print("Exiting...")
    elif selection == options[0]:
        create_creators()
    elif selection == options[1]:
        create_products()
    elif selection == options[2]:
        create_stores()
    elif selection == options[3]:
        create_videos()

def run_crawler_menu():
    options = [" > Top Stores", " > Top Stores Details", " > Top Products", " > Quit"]
    terminal_menu = TerminalMenu(options, title="Select an option")
    menu_entry_index = terminal_menu.show()
    
    selection = options[menu_entry_index]
    print(f"You selected: {selection}")

    if selection == "Quit":
        print("Exiting...")
    elif selection == options[0]:
        run_request_top_stores()
    elif selection == options[1]:
        run_request_top_stores_details()
    elif selection == options[2]:
        run_request_top_products()
    # elif selection == "Top Products Details":
    #     run_request_top_products_details()

def main(): 
    options = ["Create Tables", "Run Crawler", "Quit"]
    terminal_menu = TerminalMenu(options, title="Select an option")
    menu_entry_index = terminal_menu.show()
    selection = options[menu_entry_index]
    print(f"You selected: {selection}")

    if selection == "Quit":
        print("Exiting...")
    elif selection == "Create Tables":
        create_tables_menu()
    elif selection == "Run Crawler":
        run_crawler_menu()

if __name__ == "__main__":
    main()
from simple_term_menu import TerminalMenu

# from postgres_tables.create_categories import create_categories
# from postgres_tables.create_creators import create_creators
# from postgres_tables.create_products import create_products
# from postgres_tables.create_stores import create_stores
# from postgres_tables.create_videos import create_videos

from request_categories.main import main as run_request_categories
from request_top_stores.main import main as run_request_top_stores_convext
from request_top_stores_details.main import main as run_request_top_stores_details
from request_top_products.main import main as run_request_top_products
from request_top_products_details.main import main as run_request_top_products_details

# def create_tables_menu():
#     options = [" > Categories", " > Creators", " > Products", " > Stores", " > Videos", "  << Return", "   * Quit"]
#     terminal_menu = TerminalMenu(options, title="Select an option")
#     menu_entry_index = terminal_menu.show()
    
#     selection = options[menu_entry_index]
#     print(f"You selected: {selection}")

#     if selection == options[6]:
#         print("Exiting...")
#     elif selection == options[5]:
#         main()
#     elif selection == options[0]:
#         create_categories()
#     elif selection == options[1]:
#         create_creators()
#     elif selection == options[2]:
#         create_products()
#     elif selection == options[3]:
#         create_stores()
#     elif selection == options[4]:
#         create_videos()

# def run_crawler_postgres_menu():
#     options = [" > [POSTGRES] Categories", " > [POSTGRES] Top Stores", "  > [POSTGRES] Top Stores Details", " > [POSTGRES] Top Products", "  > [POSTGRES] Top Products Details", "   << Return", "   <<< Quit"]
#     terminal_menu = TerminalMenu(options, title="Select an option")
#     menu_entry_index = terminal_menu.show()
    
#     selection = options[menu_entry_index]
#     print(f"You selected: {selection}")

#     if selection == options[6]:
#         print("Exiting...")
#     elif selection == options[5]:
#         main()
#     elif selection == options[0]:
#         run_request_categories(type='postgres')
#     elif selection == options[1]:
#         run_request_top_stores_convext(type='postgres')
#     elif selection == options[2]:
#         run_request_top_stores_details(type='postgres')
#     elif selection == options[3]:
#         run_request_top_products_convext(type='postgres')
#     elif selection == options[4]:
#         run_request_top_products_details(type='postgres')


def run_crawler_convext_menu():
    options = [" - Categories", " - Top Stores", "  -- Top Stores Details", " - Top Products", "  -- Top Products Details", "   << Return", "   <<< Quit"]
    terminal_menu = TerminalMenu(options, title="Select an option")
    menu_entry_index = terminal_menu.show()
    
    selection = options[menu_entry_index]
    print(f"You selected: {selection}")

    if selection == options[6]:
        print("Exiting...")
    elif selection == options[5]:
        main()
    elif selection == options[0]:
        run_request_categories(type='convex')
    elif selection == options[1]:
        run_request_top_stores_convext(type='convex')
    elif selection == options[2]:
        run_request_top_stores_details(type='convex')
    elif selection == options[3]:
        run_request_top_products_convext(type='convex')
    elif selection == options[4]:
        run_request_top_products_details(type='convex')

def main(): 
    options = ["Run Crawler", " * Quit"]
    terminal_menu = TerminalMenu(options, title="Select an option")
    menu_entry_index = terminal_menu.show()
    selection = options[menu_entry_index]
    print(f"You selected: {selection}")

    # if selection == options[0]:
    #     create_tables_menu()
    # elif selection == options[1]:
    #     run_crawler_postgres_menu()
    if selection == options[0]:
        run_crawler_convext_menu()
    elif selection == options[1]:
        print("Exiting...")

if __name__ == "__main__":
    main()
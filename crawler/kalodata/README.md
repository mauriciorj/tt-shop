## Kalodata

### Notes

If the databases are not created, run the following commands:

```bash
python3 ./selenium/kalodata/postgres_tables/create_stores.py
python3 ./selenium/kalodata/postgres_tables/create_top_products.py
python3 ./selenium/kalodata/postgres_tables/create_creators.py
```

### Crawler

Should run first either request_top_stores or request_top_products to populate the databases with initial data.

```bash
python3 ./selenium/kalodata/request_top_stores/main.py
python3 ./selenium/kalodata/request_top_products/main.py
```

Then run the request_each_top_store_details it will populate the stores table with the details of each store.

This script will also populate the creators table.

```bash

```

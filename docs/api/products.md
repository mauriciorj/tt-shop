# GET /api/products

Returns products sorted by revenue (descending) with cursor-based pagination.

## Request

```
GET /api/products?limit=10&cursor=<cursor>
Authorization: Bearer <api_key>
```

### Query parameters

| Parameter | Type   | Default | Description                                                        |
| --------- | ------ | ------- | ------------------------------------------------------------------ |
| `limit`   | number | `10`    | Number of items per page (1–100)                                   |
| `cursor`  | string | —       | Continuation cursor from a previous response (omit for first page) |

### Authentication

Requires a valid API key in the `Authorization: Bearer` header.
Generate a key from `/apiKey` in the app or via [[keys]].

## Response

```json
{
  "data": [
    {
      "k_id": "string",
      "name": "string",
      "country": "string",
      "revenue": 12345.67,
      "revenue_7_days": 1234.56,
      "revenue_14_days": 2345.67,
      "revenue_growth_rate": 0.12,
      "revenue_history": [100, 200, 300],
      "sales": 890,
      "product_rating": 4.8,
      "unit_price": 29.99,
      "image": "https://... | null",
      "category_name": "string | null"
    }
  ],
  "total": 10,
  "cursor": "string",
  "isDone": false
}
```

## Field descriptions

### Data fields

| Field                 | Type           | Description                              |
| --------------------- | -------------- | ---------------------------------------- |
| `k_id`                | string         | Unique product identifier (Kalodata ID)  |
| `name`                | string         | Product name                             |
| `country`             | string         | Market country                           |
| `revenue`             | number         | Total revenue (BRL)                      |
| `revenue_7_days`      | number \| null | Revenue over last 7 days                 |
| `revenue_14_days`     | number \| null | Revenue over last 14 days                |
| `revenue_growth_rate` | number         | Revenue growth rate                      |
| `revenue_history`     | number[]       | Historical revenue data points           |
| `sales`               | number         | Total units sold                         |
| `product_rating`      | number         | Product rating score                     |
| `unit_price`          | number         | Price per unit                           |
| `image`               | string \| null | Product thumbnail URL (Convex storage)   |
| `category_name`       | string \| null | Category label                           |

### Pagination fields

| Field    | Type    | Description                                   |
| -------- | ------- | --------------------------------------------- |
| `total`  | number  | Number of items in this page                  |
| `cursor` | string  | Pass as `cursor` param to fetch the next page |
| `isDone` | boolean | `true` when there are no more pages           |

## Errors

| Status | Reason                              |
| ------ | ----------------------------------- |
| 401    | Missing or invalid API key          |
| 429    | API call limit reached (1,000 req)  |
| 500    | Failed to fetch from Convex         |

## Data source

Convex `products` table via `getProductsWithPagination` query, sorted by `by_k_revenue` index (desc), paginated with Convex cursor pagination.

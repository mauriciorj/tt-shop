# GET /api/videos

Returns the top 10 videos sorted by revenue (descending).

## Request

```
GET /api/videos
```

No authentication required. No query parameters.

## Response

```json
{
  "data": [
    {
      "video_id": "string",
      "description": "string",
      "revenue": 12345.67,
      "sales": 890,
      "views": 1500000,
      "duration": "0:45",
      "image": "https://...",
      "category": "string | null",
      "tt_account": "string | null"
    }
  ],
  "total": 10
}
```

## Field descriptions

| Field         | Type            | Description                        |
| ------------- | --------------- | ---------------------------------- |
| `video_id`    | string          | Unique video identifier (k_id)     |
| `description` | string          | Video title / caption              |
| `revenue`     | number          | Total revenue (BRL)                |
| `sales`       | number          | Total units sold                   |
| `views`       | number          | Total view count                   |
| `duration`    | string          | Video length (e.g. "0:45")         |
| `image`       | string \| null  | Thumbnail URL (from Convex storage)|
| `category`    | string \| null  | Category name                      |
| `tt_account`  | string \| null  | TikTok account handle              |

## Errors

| Status | Reason                         |
| ------ | ------------------------------ |
| 500    | Failed to fetch from Convex    |

## Data source

Convex `videos` table, sorted by `k_revenue` index (desc), first 10 results.

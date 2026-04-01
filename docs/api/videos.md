# GET /api/videos

Returns videos sorted by revenue (descending) with cursor-based pagination.

## Request

```
GET /api/videos?limit=10&cursor=<cursor>
```

No authentication required.

### Query parameters

| Parameter | Type   | Default | Description                                              |
| --------- | ------ | ------- | -------------------------------------------------------- |
| `limit`   | number | `10`    | Number of items per page (1–100)                         |
| `cursor`  | string | —       | Continuation cursor from a previous response (omit for first page) |

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
  "total": 10,
  "cursor": "string",
  "isDone": false
}
```

## Field descriptions

### Data fields

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

### Pagination fields

| Field    | Type    | Description                                                       |
| -------- | ------- | ----------------------------------------------------------------- |
| `total`  | number  | Number of items in this page                                      |
| `cursor` | string  | Pass as `cursor` param to fetch the next page                     |
| `isDone` | boolean | `true` when there are no more pages                               |

## Errors

| Status | Reason                         |
| ------ | ------------------------------ |
| 500    | Failed to fetch from Convex    |

## Data source

Convex `videos` table via `getVideos` query, sorted by `by_k_revenue` index (desc), paginated with Convex cursor pagination.

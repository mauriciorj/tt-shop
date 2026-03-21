/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as categories from "../categories.js";
import type * as creators from "../creators.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as products from "../products.js";
import type * as savedProducts from "../savedProducts.js";
import type * as savedStores from "../savedStores.js";
import type * as savedVideos from "../savedVideos.js";
import type * as stores from "../stores.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";
import type * as videos from "../videos.js";
import type * as waitlist from "../waitlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  categories: typeof categories;
  creators: typeof creators;
  files: typeof files;
  http: typeof http;
  products: typeof products;
  savedProducts: typeof savedProducts;
  savedStores: typeof savedStores;
  savedVideos: typeof savedVideos;
  stores: typeof stores;
  users: typeof users;
  utils: typeof utils;
  videos: typeof videos;
  waitlist: typeof waitlist;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

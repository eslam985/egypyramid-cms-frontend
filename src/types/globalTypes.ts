// /src/types/globalTypes.ts

// 🌍 الأنواع الأساسية والعامة
export type dataType = string | number | Date

// =================================
// ========== API Response =========
// =================================

// 🌍 1. القالب العام الثابت لكل ردود سيرفر Express عندك
export interface BaseApiResponse<T = null> {
  success: boolean
  message: string
  data: T // الحقل الديناميكي الذي يتغير حسب الـ API
  pagination?: {
    total: number | string
    page:  number | string
    limit:  number | string
    totalPage: number | string
  },
}
export interface BaseQueryRequest {
  page?: string
  limit?: string
}

//
// 👤 2.
export interface UserDataResponse {
  accessToken?: string
  userId?: string | number
  roles?: string | number // لأن الباك إند يحولها لـ parseInt أو يرسلها كرقم
  id?:string | number
  username?: string
  email?: string
  avatar_url?: string | null
  avatar_history?: string[] | null // مصفوفة الروابط الخاصة بالأفاتارز القديمة
  created_at?: dataType
  updated_at?: dataType
}

// 📦 3.
export interface RegisterDataResponse {
  id: string | number
  username: string
  email: string
  [key: string]: any // لضمان قبول أي حقول إضافية يفككها السيرفيس
}

export interface UserSeassionDataResponse {
  id: string | number
  user_id: string | number
  user_agent: string
  ip_address: string
  expires_at: dataType
  created_at: dataType
  updated_at: dataType
}

export interface sortedSessionRequiest {
// sortBy = "expires_at", sortOrder = "ASC"
  sortBy?: string
  sortOrder?: string
}

export interface SystemCountersResponse {
  total_medias: string | number
  ready_medias: string | number
  not_ready_medias: string | number
  total_seasons: string | number
  total_episodes: string | number
  total_genres: string | number
  total_tasks: string | number
  total_processing: string | number
  total_idle: string | number
  total_failed: string | number
  total_links: string | number
  count_broken_links: string | number
  count_valid_links: string | number
  count_pending_links: string | number
  missing_telegram: string | number
  missing_dood: string | number
  missing_lulu: string | number
  missing_mixdrop: string | number
  missing_streamtape: string | number
  missing_voe: string | number
  missing_vk: string | number
  missing_archive: string | number
}

// ✅ تعديل: تصحيح الاسم إملائياً لـ StatusTasksRequest
export enum StatusTasksRequest {
  valid = "valid",
  broken = "broken",
  pending = "pending",
}

// ✅ تعديل: تصحيح الاسم إملائياً، وربط last_check_status بالـ Enum مباشرة
export interface TotalStatusTasksResponse {
  server_name: string
  last_check_status: StatusTasksRequest // أصبحت محمية بالـ Enum بدلاً من string مفتوح
  total: number | string
}

export interface DownloadTasksResponse {
  id?: string | number
  task_name?: string
  source_url?: string
  status?: string
  progress_percent?: string | number
  download_speed?: string
  status_message?: string
  created_at?: dataType
  updated_at?: dataType
  is_cancelled?: boolean
  trailer_url?: string
  normalized_task_name?: string
  task_year?: string
  fallback_urls?: string[]
}

export interface serverNameRequest extends BaseQueryRequest {
  serverName?: string
}

export interface MediasResponse {
  id?: string | number
  tmdb_id?: string
  title?: string
  story?: string
  poster_url?: string
  category?: string
  year?: string
  rating?: string
  created_at?: dataType
  updated_at?: dataType
  labels?: string
  runtime?: string
  duration_iso?: string
  media_type?: string
  is_ready?: boolean
  is_notified?: boolean
  is_facebook_posted?: boolean
  facebook_posted_at?: dataType
  normalized_title?: string
  slug?: string
}

// =================================
// ========== API Requiest =========
// =================================


export interface BaseStore {
  isLoading?: boolean;
  successMessage?: string;
  errorMessage?: string;
  _lastFetchArgs?: string;
  [key: string]: any;
}

export interface JwtUserPayload {
  userId: string | number;
  roles: string | number;
  iat?: number;
  exp?: number;
}

// 🛠️ تنظيف مساعدات الـ Utilities باستخدام الـ BaseStore

export interface ExportStoreParams {
  store?: BaseStore | null; // اختصار سحري ونظيف!
  apiCall: (...args: any[]) => Promise<any> | any;
  args?: any[] | Record<string, any>;
  defaultFileName?: string;
  defaultError?: string;
}

export interface ConfirmAndDeleteParams {
  message?: string;
  action: () => Promise<boolean> | boolean;
  store?: BaseStore | null;
  notiStore: {
    triggerConfirm: (msg: string) => Promise<boolean> | boolean;
    triggerNotification: (msg: string) => void;
    [key: string]: any;
  };
  onSuccess?: () => Promise<void> | void;
  fallbackSuccess?: string;
  fallbackError?: string;
}

export interface StoreFetchParams {
  store?: BaseStore | null;
  apiCall: (...args: any[]) => Promise<any> | any;
  args?: any[] | Record<string, any>;
  targetKey?: string;
  defaultError?: string;
  paginationKey?: string;
  force?: boolean;
}

export interface StoreAddParams {
  store?: BaseStore | null;
  apiCall: (...args: any[]) => Promise<any> | any;
  id?: string | number;
  data?: Record<string, any>;
  listKey?: string;
  defaultError?: string;
}

export interface StoreEditParams {
  store?: BaseStore | null;
  apiCall: (...args: any[]) => Promise<any> | any;
  id?: string | number;
  data?: Record<string, any>;
  listKey?: string;
  idKey?: string;
  defaultError?: string;
}

export interface StoreDeleteParams {
  store?: BaseStore | null;
  apiCall: (...args: any[]) => Promise<any> | any;
  id?: string | number | any[];
  listKey?: string;
  idKey?: string;
  defaultError?: string;
  filterFn?: ((items: any[]) => any[]) | null;
}

// 1️⃣ صممنا العقد (Interface) لمدخلات الدالة بـ Best Practices
export interface SearchParamsType {
  searchInput: string;
  notiStore: (msg: string) => void; // دالة إطلاق إشعار لا ترجع شيئاً (void)
  targetStore: {
    errorMessage: string;
    [key: string]: any;
  };
  apiCallById: (id: number) => Promise<any>; // يقبل رقم ويرجع كائن العنصر
  apiCallAll: (force?: boolean) => Promise<any>;
  apiCallByName: (name: string, force?: boolean) => Promise<any>;
  defaultErrorMsg?: string;
}

// وصفت شكل مخرجات الدالة المتوقعة لـ TypeScript
export interface SearchResultData {
  targetId: number | null;
  rawValue: string | null;
}

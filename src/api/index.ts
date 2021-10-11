import { Adsapi } from './lib/api';
export default Adsapi;

export type { IUserData } from './lib/bootstrap/types';
export type { IADSApiGraphicsParams, IADSApiGraphicsResponse } from './lib/graphics/types';
export type {
  CitationsHistogramType,
  IADSApiMetricsParams,
  IADSApiMetricsResponse,
  ReadsHistogramType,
} from './lib/metrics/types';
export type { SolrField, SolrSort, SolrSortDirection, SolrSortField } from './lib/models';
export type { IADSApiReferenceParams, IADSApiReferenceResponse } from './lib/reference/types';
export type {
  IADSApiSearchErrorResponse,
  IADSApiSearchParams,
  IADSApiSearchResponse,
  IDocsEntity,
} from './lib/search/types';

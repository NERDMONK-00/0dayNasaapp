import type { DataSource } from '../types'

export type { DataSource }

// This interface is the extension point for future hardware data sources.
// The app depends only on `subscribe(callback)`, so changing the source does not
// require any UI or analysis-layer changes.
export interface DataSourceContract extends DataSource {}

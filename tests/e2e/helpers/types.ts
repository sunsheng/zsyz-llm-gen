export interface RouteDef {
  route: string
  title: string
  pageType: 'map' | 'atlas' | 'analysis' | 'dashboard' | 'list' | 'graph'
}

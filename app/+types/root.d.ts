// Type declarations for root route

export namespace Route {
  export type LinksFunction = () => Array<{
    rel: string;
    href: string;
    crossOrigin?: string;
  }>;

  export type ErrorBoundaryProps = {
    error: unknown;
  };
}

import type { ComponentType, LazyExoticComponent, ReactNode } from 'react';
import { Suspense, lazy } from 'react';

import { RouteFallback } from '../components/common/RouteFallback';

export function lazyPage(
  factory: () => Promise<{ default: ComponentType }>,
): LazyExoticComponent<ComponentType> {
  return lazy(factory);
}

export function withSuspense(
  Page: LazyExoticComponent<ComponentType>,
): () => ReactNode {
  return function SuspendedPage() {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Page />
      </Suspense>
    );
  };
}

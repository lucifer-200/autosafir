import NextLink from "next/link";
import type { ComponentProps } from "react";

/** Static demos cannot rely on host-specific segment-prefetch rewrites. */
export function StaticLink(props: ComponentProps<typeof NextLink>) {
  return <NextLink {...props} prefetch={false} />;
}

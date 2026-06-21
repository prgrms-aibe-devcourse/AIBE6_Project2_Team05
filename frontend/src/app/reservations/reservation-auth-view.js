import { useSyncExternalStore } from "react";

const ACCESS_TOKEN_KEY = "wedge_access_token";

function subscribeToHydration() {
  return () => {};
}

export function useReservationAuthState() {
  const isMounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  return {
    isMounted,
    hasAccessToken:
      isMounted && globalThis.localStorage?.getItem(ACCESS_TOKEN_KEY) !== null,
  };
}

export function shouldRenderReservationAuth({
  hasAccessToken,
  isMounted,
}) {
  return isMounted && hasAccessToken;
}

export function shouldRedirectReservationAuth({
  hasAccessToken,
  isMounted,
}) {
  return isMounted && !hasAccessToken;
}

import getSignedHeaders from "happy-headers";

export function getAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    ...getSignedHeaders()
  }
}

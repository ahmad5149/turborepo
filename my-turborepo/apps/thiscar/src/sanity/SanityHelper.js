import sanityClient from "./SanityClient";
import { cache } from "react";

const useSanity = cache(sanityClient.fetch.bind(sanityClient));
function SanityFetch(query) {
  return useSanity(query);
}

export { SanityFetch };

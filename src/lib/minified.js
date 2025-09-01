export const imgMinified = (src) => {
  if (!src) return "";
  // Only modify Shopify URLs
  if (!src.includes("shopify.com")) return src;

  const [base, query] = src.split("?");
  const newBase = base.replace(/(\.[a-zA-Z]+)$/, "_250x250$1");
  return query ? `${newBase}?${query}` : newBase;
};

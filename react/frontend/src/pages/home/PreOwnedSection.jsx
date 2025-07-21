import React from "react";
import { useFetchProductsQuery } from "../../redux/features/products/productsApi";
import ProductCards from "../../components/ProductCards";

function PreOwnedSection() {
  const { data: products = [], isLoading, isError } = useFetchProductsQuery();

  const previewProducts = products
    .filter((p) => p.category === "pre-owned")
    .slice(0, 4); // show only first 4

  if (isLoading) return <div>Loading pre-owned products...</div>;
  if (isError) return <div>Error loading pre-owned products.</div>;

  return (
    <ProductCards products={previewProducts} categories={["pre-owned"]} />
  );
}

export default PreOwnedSection;

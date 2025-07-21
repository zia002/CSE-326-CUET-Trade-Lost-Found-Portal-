import React from "react";
import { useFetchProductsQuery } from "../../redux/features/products/productsApi";
import ProductCards from "../../components/ProductCards";

function LostFoundSection() {
  const { data: products = [], isLoading, isError } = useFetchProductsQuery();

  const previewProducts = products
    .filter((p) => p.category === "lost" || p.category === "found")
    .slice(0, 4); // Show only first 4

  if (isLoading) return <div>Loading lost & found items...</div>;
  if (isError) return <div>Error loading lost & found items.</div>;

  return (
    <ProductCards
      products={previewProducts}
      categories={["lost", "found"]}
    />
  );
}

export default LostFoundSection;

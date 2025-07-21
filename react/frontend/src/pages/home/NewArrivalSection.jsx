import React from "react";
import { useFetchProductsQuery } from "../../redux/features/products/productsApi";
import ProductCards from "../../components/ProductCards";

function NewArrivalSection() {
  const { data: products = [], isLoading, isError } = useFetchProductsQuery();

  const newArrivalProducts = products
    .filter((p) =>
      ["fashion", "electronics", "digital", "others"].includes(p.category)
    )
    .slice(0, 4); // Preview only 4 items

  if (isLoading) return <div>Loading new arrivals...</div>;
  if (isError) return <div>Error loading products.</div>;

  return (
    <ProductCards
      products={newArrivalProducts}
      categories={["fashion", "electronics", "digital", "others"]}
    />
  );
}

export default NewArrivalSection;

import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";

import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get("/api/products?id=" + id)
      .then((resp) => setProductInfo(resp.data));
  }, [id]);

  return (
    <Layout>
      <h1>Edit Product</h1>
      {productInfo && (
        <ProductForm
          _id={productInfo?._id}
          existingTitle={productInfo?.title}
          existingDescription={productInfo?.description}
          existingPrice={productInfo?.price}
          existingImages={productInfo?.images}
          existingCategory={productInfo?.category}
          existingProperties={productInfo?.properties}
        />
      )}
    </Layout>
  );
}

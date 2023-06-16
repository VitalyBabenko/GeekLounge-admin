import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
  _id,
  existingTitle,
  existingDescription,
  existingPrice,
  images,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  const saveProduct = async (e) => {
    e.preventDefault();
    const newProduct = { title, description, price };
    if (_id) {
      // update
      await axios.put("/api/products", { ...newProduct, _id });
    } else {
      // create
      await axios.post("/api/products", newProduct);
    }
    setGoToProducts(true);
  };

  function uploadImages(e) {
    const files = e.target?.files;
    if (files?.length > 0) {
      const data = new FormData();
      files.forEach((file) => data.append("file", file));
      // axios
    }
  }

  if (goToProducts) {
    router.push("/products");
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="product name"
      />

      <label>Photos</label>
      <div>
        <label className="w-24 h-24 mb-2 cu text cursor-pointer center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input type="file" hidden onChange={uploadImages} />
        </label>
        {!images?.length && (
          <div className="mb-2">No photos in this product</div>
        )}
      </div>

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="description"
      ></textarea>
      <label>Price (in USD)</label>
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
        placeholder="price"
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}

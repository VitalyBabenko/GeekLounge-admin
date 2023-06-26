import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { UploadIcon } from "@/assets/icons";

export default function ProductForm({
  _id,
  existingTitle,
  existingDescription,
  existingPrice,
  existingImages,
  existingCategory,
  existingProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [category, setCategory] = useState(existingCategory || "");
  const [productProperties, setProductProperties] = useState(
    existingProperties || {}
  );
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((resp) => setCategories(resp.data));
  }, []);

  const saveProduct = async (e) => {
    e.preventDefault();
    const newProduct = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };

    if (_id) {
      // update
      await axios.put("/api/products", { ...newProduct, _id });
    } else {
      // create
      await axios.post("/api/products", newProduct);
    }
    setGoToProducts(true);
  };

  const uploadImages = async (e) => {
    const files = e.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const formData = new FormData();
      for (const file of files) {
        formData.append("file", file);
      }

      const { data } = await axios.post("/api/upload", formData);
      setImages((oldImages) => {
        return [...oldImages, ...data.links];
      });
      setIsUploading(false);
    }
  };

  function updateImagesOrder(images) {
    setImages(images);
  }

  if (goToProducts) {
    router.push("/products");
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);

    if (catInfo) propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="product name"
      />

      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {propertiesToFill?.length > 0 &&
        propertiesToFill.map((p) => (
          <div className="" key={p.name}>
            <label>{p?.name[0]?.toUpperCase() + p?.name?.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(e) => setProductProp(p.name, e.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-2"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-2 shadow-sm rounded-md border border-gray-200"
              >
                <img src={link} alt="product image" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>

        {isUploading && (
          <div className="h-24 w-24 flex items-center justify-center ">
            <Spinner />
          </div>
        )}
        <div>
          <label className=" w-24 h-24 mb-2  text cursor-pointer center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-lg bg-white shadow-sm border border-primary ">
            <UploadIcon />
            <div>Add image</div>
            <input type="file" hidden onChange={uploadImages} />
          </label>
        </div>
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
        onChange={(e) => setPrice(+e.target.value)}
        type="number"
        placeholder="price"
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}

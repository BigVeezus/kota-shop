import React, { useState, useEffect } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import toast from "react-hot-toast";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7; // Set the limit of rows per page to 7
  const [updatePage, setUpdatePage] = useState(true);

  useEffect(() => {
    fetchProductsData();
  }, [updatePage]);

  const fetchProductsData = () => {
    fetch(`http://localhost:8080/items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.data)) {
          setAllProducts(data.data);
        } else {
          setAllProducts([]); // Fallback to empty array if data.data is not an array
          console.error("Expected an array in the response data");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products data:", err);
        setAllProducts([]); // Set to empty array to prevent errors in rendering
      });
  };
  
  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };

  const updateProductModalSetting = (selectedProductData) => {
    console.log("Clicked: edit");
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  const deleteItem = (id) => {
    console.log("Product ID: ", id);

    fetch(`http://localhost:8080/item/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to delete the item.");
        }
      })
      .then((data) => {
        setUpdatePage((prevState) => !prevState);
        toast.success("Item deleted successfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete the item.");
      });
  };

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = filteredProducts?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const onProductUpdated = () => {
    setUpdatePage((prevState) => !prevState);
    toast.success("Product updated successfully!");
  };

  const lowStockCount = products?.filter(
    (product) => product.quantity < 5
  ).length;
  const outOfStockCount = products?.filter(
    (product) => product.quantity === 0
  ).length;

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
      <div className="bg-white rounded-lg shadow-lg p-6">
  <h2 className="font-semibold text-xl text-gray-800 mb-4 px-4">Overall Inventory</h2>
  <div className="flex flex-col md:flex-row justify-around items-center gap-6">
    <div className="flex flex-col p-10 w-full md:w-3/12 bg-blue-50 rounded-lg shadow-md text-center">
      <h3 className="font-semibold text-blue-700 text-3xl mb-2">Total Items</h3>
      <span className="font-semibold text-gray-600 text-4xl">{products.length}</span>
    </div>
    <div className="flex flex-col p-10 w-full md:w-3/12 bg-red-50 rounded-lg shadow-md text-center">
      <h3 className="font-semibold text-red-700 text-3xl mb-4">Low Stocks</h3>
      <div className="flex gap-12 justify-center">
        <div className="flex flex-col items-center">
          <span className="font-semibold text-gray-600 text-4xl">{lowStockCount}</span>
          <span className="font-thin text-red-400 text-base">Low</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-gray-600 text-4xl">{outOfStockCount}</span>
          <span className="font-thin text-red-400 text-base">Not in Stock</span>
        </div>
      </div>
    </div>
  </div>
</div>

        {showProductModal && (
          <AddProduct
            addProductModalSetting={addProductModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateProduct
            updateProductData={updateProduct}
            updateModalSetting={updateProductModalSetting}
            onProductUpdated={onProductUpdated}
          />
        )}

<div className="overflow-x-auto rounded-lg border bg-white border-gray-200 mt-6 shadow-lg">
  <div className="flex justify-between p-4 bg-gray-100">
    <div className="flex gap-4 items-center">
      <h3 className="font-bold text-lg text-gray-800">Products</h3>
      <div className="flex items-center px-3 py-1 bg-white border rounded-md">
        <img alt="search-icon" className="w-5 h-5" src={require("../assets/search-icon.png")} />
        <input
          className="border-none outline-none focus:ring-0 text-sm ml-2"
          type="text"
          placeholder="Search here"
          value={searchTerm}
          onChange={handleSearchTerm}
        />
      </div>
    </div>
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 text-xs rounded-md"
      onClick={addProductModalSetting}
    >
      Add Product
    </button>
  </div>

  {products.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-10">
      <img
        alt="no-items-icon"
        className="w-20 h-20"
        src={require("../assets/no-items-icon.png")}
      />
      <span className="text-gray-600 text-xl mt-3">You haven't added any items</span>
    </div>
  ) : (
    <>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Food Items</th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Type</th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Quantity</th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Status</th>
            <th className="px-6 py-3 text-left font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentProducts.map((element) => (
            <tr key={element._id} className="hover:bg-gray-100">
              <td className="px-6 py-4">{element.name}</td>
              <td className="px-6 py-4">{element.type}</td>
              <td className="px-6 py-4">{element.quantity}</td>
              <td className="px-6 py-4">{element.quantity > 0 ? "In Stock" : "Not in Stock"}</td>
              <td className="px-6 py-4 flex gap-4">
                <button
                  className="text-green-600 hover:text-green-800"
                  onClick={() => updateProductModalSetting(element)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => deleteItem(element._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end p-4">
        <nav className="block">
          <ul className="flex pl-0 rounded list-none flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <li
                key={pageNumber}
                className={`first:ml-0 text-xs font-semibold flex w-6 h-6 mx-1 p-0 cursor-pointer items-center justify-center leading-tight ${
                  pageNumber === currentPage ? "bg-gray-300 text-gray-600" : "bg-white text-gray-600"
                }`}
                onClick={() => paginate(pageNumber)}
              >
                {pageNumber}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )}
</div>
      </div>
    </div>
  );
}

export default Inventory;

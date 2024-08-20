import React, { useState, useEffect,  } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
// import AuthContext from "../AuthContext";
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

  // Fetching Data of All Products, delete when you connect to the backend and use the other one

  const fetchProductsData = () => {
    const mockData = {
      "status": 200,
      "msg": "Got all items",
      "data": [
        {
          "_id": "66c0d70bee73393c9dcdcb74",
          "name": "edited bread name 1",
          "type": "FOOD",
          "quantity": 5,
          "createdAt": "2024-08-17T16:59:55Z",
          "updatedAt": "2024-08-17T16:59:55Z"
        },
        {
          "_id": "66c0e06362aeda7e4e22e073",
          "name": "bread1",
          "type": "FOOD",
          "quantity": 5,
          "createdAt": "2024-08-17T17:39:47Z",
          "updatedAt": "2024-08-17T17:39:47Z"
        },
        {
          "_id": "66c0e06662aeda7e4e22e074",
          "name": "bread2",
          "type": "FOOD",
          "quantity": 5,
          "createdAt": "2024-08-17T17:39:50Z",
          "updatedAt": "2024-08-17T17:39:50Z"
        },
        {
          "_id": "66c324fd05d44e6b09fd3240",
          "name": "milk",
          "type": "FOOD",
          "quantity": 5,
          "createdAt": "2024-08-19T10:57:01Z",
          "updatedAt": "2024-08-19T10:57:01Z"
        },
        {
          "_id": "66c325ff05d44e6b09fd3241",
          "name": "butter",
          "type": "FOOD",
          "quantity": 3,
          "createdAt": "2024-08-19T10:58:01Z",
          "updatedAt": "2024-08-19T10:58:01Z"
        },
        {
          "_id": "66c3260005d44e6b09fd3242",
          "name": "apple",
          "type": "FRUIT",
          "quantity": 20,
          "createdAt": "2024-08-19T10:59:01Z",
          "updatedAt": "2024-08-19T10:59:01Z"
        },
        {
          "_id": "66c3260105d44e6b09fd3243",
          "name": "orange juice",
          "type": "BEVERAGE",
          "quantity": 15,
          "createdAt": "2024-08-19T11:00:01Z",
          "updatedAt": "2024-08-19T11:00:01Z"
        },
        {
          "_id": "66c3260205d44e6b09fd3244",
          "name": "cereal",
          "type": "FOOD",
          "quantity": 8,
          "createdAt": "2024-08-19T11:01:01Z",
          "updatedAt": "2024-08-19T11:01:01Z"
        }
      ]
    };
  
    setAllProducts(mockData.data);
  };
  
console.log("products",products);
  // const fetchProductsData = () => {
  //   fetch(`http://localhost:4000/items`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setAllProducts(data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // Fetching Data of Search Products



  // Modal for Product ADD
  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };

  // Modal for Product UPDATE
  const updateProductModalSetting = (selectedProductData) => {
    console.log("Clicked: edit");
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };


  // Delete item
  const deleteItem = (id) => {
    console.log("Product ID: ", id);
 
    
    fetch(`http://localhost:8080/api/item/${id}`, {
      method: "DELETE", // Assuming DELETE method is used for deletion
      headers: {
        "Content-Type": "application/json",
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
      toast.success("Item deleted successfully!"); // Show alert on successful deletion
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete the item.");
      });
  };
    // Handle search input
    const handleSearchTerm = (event) => {
      setSearchTerm(event.target.value);
      setCurrentPage(1); // Reset to the first page when search term changes
    };

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
 // Pagination logic
 const indexOfLastProduct = currentPage * rowsPerPage;
 const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
 const currentProducts = filteredProducts.slice(
   indexOfFirstProduct,
   indexOfLastProduct
 );

 const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

 const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle Page Update
  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };
 // Calculate Low Stocks and Out of Stock items
 const lowStockCount = products.filter(product => product.quantity < 5).length;
 const outOfStockCount = products.filter(product => product.quantity === 0).length;
 
  return (
    <div className="col-span-12 lg:col-span-10  flex justify-center">
      <div className=" flex flex-col gap-5 w-11/12">
        <div className="bg-white rounded p-3">
          <span className="font-semibold px-4">Overall Inventory</span>
          <div className=" flex flex-col md:flex-row justify-center items-center  ">
            <div className="flex flex-col p-10  w-full  md:w-3/12 md:border-x-2  ">
              <span className="font-semibold text-blue-700 text-3xl text-center">
                Total Items
              </span>
              <br/>
              <span className="font-semibold text-gray-600 text-3xl text-center">
                {products.length}
              </span>
              {/* <span className="font-thin text-gray-400 text-xs">
                Last 7 days
              </span> */}
            </div>
         
            <div className="flex flex-col gap-3 p-10  w-full  md:w-3/12  border-y-2   md:border-y-0">
              <span className="font-semibold text-red-700 text-3xl text-center">
                Low Stocks
              </span>
              <div className="flex gap-12 justify-center ">
                <div className="flex flex-col text-center">
                  <span className="font-semibold text-gray-600 text-4xl text-center">
                  {lowStockCount}
                  </span>
                  <span className="font-thin text-red-400 text-base">
             Low
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 text-4xl text-center">
                 {outOfStockCount}
                  </span>
                  <span className="font-thin text-red-400 text-base">
                    Not in Stock
                  </span>
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
          />
        )}

        {/* Table  */}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 ">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center ">
              <span className="font-bold">Products</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md ">
                <img
                  alt="search-icon"
                  className="w-5 h-5"
                  src={require("../assets/search-icon.png")}
                />
                <input
                  className="border-none outline-none focus:border-none text-xs"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs  rounded"
                onClick={addProductModalSetting}
              >
                {/* <Link to="/inventory/add-product">Add Product</Link> */}
                Add Product
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                 Food Items
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
               Type
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                 Quantity
                </th>
            
     
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentProducts.map((element, index) => {
                return (
                  <tr key={element._id}>
                    <td className="whitespace-nowrap px-4 py-2  text-gray-900">
                      {element.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.type}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.quantity}
                    </td>
                   
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {element.quantity > 0 ? "In Stock" : "Not in Stock"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <span
                        className="text-green-700 cursor-pointer"
                        onClick={() => updateProductModalSetting(element)}
                      >
                        Edit{" "}
                      </span>
                      <span
                        className="text-red-600 px-2 cursor-pointer"
                        onClick={() => deleteItem(element._id)}
                      >
                        Delete
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
           {/* Pagination */}
           <div className="flex justify-end p-4">
            <nav className="block">
              <ul className="flex pl-0 rounded list-none">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <li key={number}>
                      <button
                        onClick={() => paginate(number)}
                        className={`${
                          currentPage === number
                            ? "bg-blue-500 text-white"
                            : "bg-white text-blue-500"
                        } hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded mx-1`}
                      >
                        {number}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;

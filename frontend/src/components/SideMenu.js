import React from "react";
import { Link, useLocation } from "react-router-dom";

function SideMenu() {
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div className="h-full flex-col justify-between  bg-white hidden lg:flex ">
      <div className="px-4 py-6">
        <nav aria-label="Main Nav" className="mt-6 flex flex-col space-y-1">
         
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary        className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 ${
                currentPath === "/"
                  ? "bg-gray-100 text-gray-700"
                  : "hover:bg-gray-100 hover:text-gray-700"
              }`}>
              <Link to="/inventory">
                <div className="flex items-center gap-2">
                  <img
                    alt="inventory-icon"
                    src={require("../assets/inventory.png")}
                    width="24"
                    height="24"
                  />
                  <span className="text-2xl font-medium"> Dashboard </span>
                </div>
              </Link>
            </summary>
          </details>

       
        
       
        </nav>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
          <img
            alt="Profile"
                src="https://i.pravatar.cc/300"
            className="h-10 w-10 rounded-full object-cover"
          />

          <div>
            <p className="text-xs">
              {/* <strong className="block font-medium">
                {localStorageData.firstName + " " + localStorageData.lastName}
              </strong> */}

              <span> {localStorageData.email} </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideMenu;

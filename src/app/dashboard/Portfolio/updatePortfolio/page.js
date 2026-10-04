'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

const Page = () => {
  const router = useRouter();
  const [active, setactive] = useState('user');
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [portfoliodata, setPortfoliodata] = useState("");
  const [assetData, setAssetData] = useState([]);

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let pid = urlParams.get("pid"); // value1

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}api/portfolio/portfoliodetails`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pid: pid }),
      }
    );
    const response = await res.json();
    setPortfoliodata(response.error);

    // Initialize the state with the initial values of assets
    setAssetData(
      response.error.Assests.map((asset) => ({
        name: asset.Assest_Title,
        price: asset.Assest_Price,
      }))
    );
  };

  const handleChange = (index, e) => {
    const updatedAssets = [...assetData];
    updatedAssets[index][e.target.name] = e.target.value;
    setAssetData(updatedAssets); // Fix the typo here
  };


  const handleSubmit = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let pid = urlParams.get("pid"); // value1
    let arr = []
    for (let i = 0; i < assetData.length; i++) {
      arr.push(parseFloat(assetData[i].price));
    }
    console.log(arr);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}api/portfolio/updatePortfolio`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedprice: arr, id: pid }),
      }
    );

    const response = await res.json()
    if (response.status == 200) {
      toast.success("Portfolio Updated Successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

    } else {
      toast.error(response.message, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    console.log(response);
    // Add your logic to update the values in the backend
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="mb-6 md:mb-0 flex flex-row justify-center my-2">
        <p className='text-2xl text-center text-white font-bold ml-3 bg-red-500 w-auto h-auto py-1 pr-2'>
          <span className=' bg-black text-white px-2 py-1'>Bluechip</span> Art
        </p>
      </div>
      <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            {portfoliodata && portfoliodata.PortfolioName}
          </h1>
          <p style={{ color: "red" }}>price must be in rupees</p>
          <form className="space-y-4 md:space-y-6" method="POST">
            {assetData.map((data, index) => (
              <div key={index}>
                <label htmlFor={data.name} className="block mb-2 text-sm font-medium text-gray-900 ">
                  {data.name}
                </label>
                <input
                  value={data.price}
                  onChange={(e) => handleChange(index, e)}
                  type="text"
                  name="price"
                  id={data.name}
                  className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder={`Enter price for ${data.name}`}
                  required=""
                />
              </div>
            ))}
            <button onClick={handleSubmit} type="button" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;

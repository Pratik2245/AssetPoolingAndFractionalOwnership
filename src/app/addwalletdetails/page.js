"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const router = useRouter();

  const [data, setData] = useState({
    walletaddress: "",
  });

  // Validate MetaMask address
  const validateMetaMaskAddress = (address) => {
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
  };

  // Handle input change
  const onChange = (e) => {
    const { value } = e.target;

    setData((prev) => ({
      ...prev,
      walletaddress: value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userEmail = localStorage.getItem("APFOS_useremail");

    if (!data.walletaddress.trim()) {
      toast.error("Wallet address is required", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    if (!validateMetaMaskAddress(data.walletaddress)) {
      toast.error("Invalid MetaMask Wallet Address", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const payload = {
      useremail: userEmail,
      walletaddress: data.walletaddress,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/addwalletaddress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const response = await res.json();

      if (response.status === 200) {
        toast.success("Wallet Address Added Successfully", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });

        setData({ walletaddress: "" });

        router.push("/");
      } else if (response.status === 201) {
        toast.error("Invalid wallet format", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      } else {
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error(error);

      toast.error("Server error", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">

      <div className="mb-6 flex justify-center">
        <p className="text-2xl text-white font-bold bg-red-500 px-2 py-1">
          <span className="bg-black px-2 py-1">Bluechip</span> Art
        </p>
      </div>

      <div className="w-full bg-white rounded-lg shadow sm:max-w-md">
        <div className="p-8 space-y-6">

          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
            MetaMask Wallet Details
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>

            <div>
              <label
                htmlFor="walletaddress"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Enter Wallet Address
              </label>

              <input
                type="text"
                id="walletaddress"
                name="walletaddress"
                value={data.walletaddress}
                onChange={onChange}
                placeholder="0x1234abcd..."
                required
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Add Wallet
            </button>

          </form>

        </div>
      </div>

    </div>
  );
};

export default Page;
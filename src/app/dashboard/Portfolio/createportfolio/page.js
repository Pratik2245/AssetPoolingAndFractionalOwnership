"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";


const Page = () => {
  const router = useRouter();
  const [pdata, setpdata] = useState({
    email: "",
    pname: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token").toString();
      const decoded = jwtDecode(token);
      console.log(decoded);
      // Check for expired token
      var dateNow = new Date() / 1000;
      if (dateNow > decoded.exp) {
        alert("Your session has been expired.");
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        if (decoded.role == "admin") {
          // fetchdata();
        }
        if (decoded.role == "user") {
          router.push('/');
        }
      }
    }
  }, []);

  const [data, setdata] = useState({
    AType: "",
    Assest_Title: "",
    Assest_Price: "",
    Assest_Quantity: "",
    Assest_Description: "",
  });
  const [Assests, setAssests] = useState([]);
  let ass = 0, amt = 0, qty = 0

  const addtolocal = (e) => {
    e.preventDefault();
    if (data.AType == "" ||
      data.Assest_Title == "" ||
      data.Assest_Price == "" ||
      data.Assest_Quantity == "" ||
      data.Assest_Description == "") {
      toast.error("Please Fill All Fields", {
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
      setAssests(Assests => [...Assests, data])
      toast.success("Asset Added", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setdata({
        AType: "",
        Assest_Title: "",
        Assest_Price: "",
        Assest_Quantity: "",
        Assest_Description: "",
      })
    }
  }



  // const handleSubmit = async (e) => {
  //   document.cookie = "PortfolioName=" + data.pname;
  // };

  const createportfolio = async () => {

    if (pdata.pname == "") {
      toast.error("Please Enter Portfolio Name", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else if (!Assests.length > 0) {
      toast.error("Add atleast one Asset to Portfolio", {
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
    else {
      let cp = confirm("Are You Sure?.Do You Want To Create Portfolio")
      if (cp) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}api/portfolio/createportfolio`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: pdata.email, pname: pdata.pname, Assests: Assests }),
          }
        );
        const response = await res.json();
        console.log(response);
        if (response.status == 200) {
          toast.success("Portfolio Created Successfully", {
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
        setAssests([])
      }

    }
  };

  const onchange = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let val = e.target.value;
    setdata({ ...data, [name]: val });
    console.log(data);
  };


  const onpchange = (e) => {
    e.preventDefault();
    setpdata({ email: localStorage.getItem("APFOS_useremail"), [e.target.name]: e.target.value })
    console.log(pdata)
  };


  const removeAssest = (index) => {
    if (Assests.length == 1 && index == 0) {
      setAssests([])
    }
    else {
      let arr = Assests
      arr.splice(index, 1)
      setAssests(arr)
    }
  };

  return (
    <div className=" w-[100%] h-full rounded p-2 pb-4 md:px-16 items-center justify-center px-6 py-8 mx-auto ">
      <h1 className="mx-auto text-center py-3 text-xl font-bold text-white md:text-2xl ">
        Create Portfolio
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-x-2 w-full">


        <div className=" w-full h-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
          <div className=" p-4 space-y-4 md:space-y-6 md:py-8 ">

            <div className="w-full mx-auto flex flex-col items-center justify-center px-4 py-2  lg:py-0">
              <div className="w-full">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Portfolio Name
                </label>
                <input
                  onChange={(e) => onpchange(e)}
                  type="text"
                  name="pname"
                  id="pname"
                  value={pdata.pname}
                  className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Enter Portfolio Name"
                  required=""
                />
              </div>

              <div className="w-full bg-white rounded shadow md:mt-0 ">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-3">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                    Add Assest
                  </h1>
                  <form className=" flex flex-wrap space-y-4 md:space-y-6" method="POST">
                    <div className="w-full">
                      <label
                        htmlFor="Assest_Title"
                        className="block mb-1 text-sm font-medium text-gray-900 "
                      >
                        Assest Name
                      </label>
                      <input
                        onChange={(e) => onchange(e)}
                        type="text"
                        name="Assest_Title"
                        id="Assest_Title"
                        value={data.Assest_Title}
                        className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                        placeholder="Enter Assest Name"
                        required=""
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="AType"
                        className="block mb-1 text-sm font-medium text-gray-900 "
                      >
                        Assest Type
                      </label>
                      <select
                        onChange={(e) => onchange(e)}
                        type="text"
                        name="AType"
                        id="AType"
                        value={data.AType}
                        className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                      >
                        <option value="" selected>
                          Select
                        </option>
                        <option value="Stock" >
                          Stock
                        </option>
                        <option value="Cryptocurrency">Cryptocurrency</option>
                        <option value="Painting Assest">
                          Painting Assest
                        </option>
                      </select>
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="Assest_Quantity"
                        className="block mb-1 text-sm font-medium text-gray-900 "
                      >
                        Assest Quantity
                      </label>
                      <input
                        onChange={(e) => onchange(e)}
                        type="number"
                        name="Assest_Quantity"
                        id="Assest_Quatity"
                        value={data.Assest_Quantity}
                        className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                        placeholder="Enter Assest Quantity"
                        required=""
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="Assest_Description"
                        className="block mb-1 text-sm font-medium text-gray-900 "
                      >
                        Assest Description
                      </label>
                      <input
                        onChange={(e) => onchange(e)}
                        type="text"
                        name="Assest_Description"
                        id="Assest_Description"
                        value={data.Assest_Description}
                        className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                        placeholder="Enter Assest Description"
                        required=""
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="Assest_Price"
                        className="block mb-1 text-sm font-medium text-gray-900 "
                      >
                        Assest Price(rupees)
                      </label>
                      <input
                        onChange={(e) => onchange(e)}
                        type="number"
                        name="Assest_Price"
                        id="Assest_Price"
                        value={data.Assest_Price}
                        className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                        placeholder="Enter Assest Price"
                        required=""
                      />
                    </div>

                    <button
                      onClick={(e) => addtolocal(e)}
                      type="submit"
                      className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded text-sm px-5 py-2.5 text-center "
                    >
                      Add
                    </button>
                  </form>
                </div>


              </div>
              <button
                onClick={createportfolio}
                type="submit"
                disabled={Assests.length === 0}
                className="w-full text-white disabled:bg-green-300 bg-green-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Create Portfolio
              </button>
            </div>

          </div>
        </div>
        <div className="w-fit text-center my-3 rounded mx-auto bg-white text-blue-900 font-semibold text-lg px-3 py-2 md:hidden">AssetList</div>
        <div className="relative rounded-lg overflow-auto w-screen md:w-auto">
          <table className="w-full  px-4 text-md text-left  text-black ">
            <thead className="text-md  text-white uppercase bg-blue-400 ">
              <tr className="">
                <th scope="col" className="px-6 py-3">
                  Asset Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Asset Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {Assests &&
                Assests.map((data, index) => {
                  amt = amt + parseInt(data.Assest_Price);
                  qty = qty + parseInt(data.Assest_Quantity);
                  ass = index + 1;
                  return (
                    <tr key={index} className="bg-white border-b ">
                      <td
                        scope="row"
                        className="px-6 py-4  text-gray-900 whitespace-nowrap "
                      >
                        <p className="text-lg font-semibold">
                          {data.Assest_Title}
                        </p>
                        <p className="text-gray-500">
                          {data.Assest_Description}
                        </p>
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4  text-gray-900 whitespace-nowrap "
                      >
                        {data.AType}
                      </td>

                      <td className="px-6 py-4">{data.Assest_Price}</td>
                      <td className="px-6 py-4 text-center">
                        <p className="w-16 border rounded-md py-1 px-2 focus:outline-none">
                          {data.Assest_Quantity}
                        </p>
                      </td>
                      <td className="px-6 py-4 ">
                        <Link
                          href=""
                          onClick={() => removeAssest(index)}
                          className="text-red-500 font-bold py-1 px-2"
                        >
                          Remove
                        </Link>
                      </td>
                    </tr>
                  );
                })}

              <tr className="bg-white border-b ">
                <td className="px-6 py-4">
                  <p className="text-lg font-semibold">Assets:{ass}</p>
                </td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4">
                  <p className="text-lg font-semibold">Price:{amt}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold py-1 px-2 ">Quantity:{qty}</p>
                </td>
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;

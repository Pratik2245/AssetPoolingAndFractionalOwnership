

"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, createContext } from "react";
import Link from 'next/link'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

export default function Main() {
    const router = useRouter();
    const [portfoliodata, setportfoliodata] = useState([]);
    useEffect(() => {
        let data = localStorage.getItem("assestlist")
        setportfoliodata(JSON.parse(data));
        const cookieValue = Cookies.get("PortfolioName");
        if (!cookieValue) {
            router.push("/Portfolio/createportfolio");
        }
    }, [])
    function removeAssest(ind) {
        portfoliodata.splice(ind, 1);

        localStorage.setItem("assestlist", JSON.stringify(portfoliodata));
        setportfoliodata(portfoliodata);
        router.push("/Portfolio/addassest/assestlist");
    }
    async function addPortfolio() {
        // let pn = getCookie("PortfolioName")
        const cookieValue = Cookies.get("PortfolioName");
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/portfolio/createportfolio`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: localStorage.getItem("APFOS_useremail"), Assests: portfoliodata, pname: cookieValue }),
        });
        const response = await res.json();
        if (response.status === 200) {
            Cookies.remove('PortfolioName');
            localStorage.removeItem("assestlist")
            toast.success("Login Successful", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            router.push("/Portfolio");
        }
    }
    return (
        <div className="w-full h-screen rounded p-2 md:px-16">
            <div className="flex justify-center items-center my-2 mb-4">
                <span className="text-white text-lg font-bold">Portfolio List</span>
            </div>
            <div className="w-[100%] overflow-auto">
                <div className="max-h-[70vh] w-[50rem] md:w-full md:p-3 bg-white rounded  p-4 md:px-2 overflow-y-scroll">
                    <div className="sticky top-0 flex bg-blue-200 rounded items-center border-b border-gray-300 px-5 py-2">
                        <div className="w-[75%] ">
                            <p className="text-lg font-bold">Asset Name</p>
                        </div>
                        <div className="w-[18%] md:w-32 text-center mx-1">
                            <p className="text-lg font-bold">Price</p>
                        </div>
                        <div className="w-[24%] text-center mx-1">
                            <p className="mx-auto font-bold w-16 py-1 px-2">Assest Type</p>
                        </div>
                        <div className="w-[24%] text-center mx-1">
                            <p className="mx-auto font-bold w-16 py-1 px-2">Assest Quantity</p>
                        </div>
                        <div className="w-[24%] text-center mx-1">
                            <p className="mx-auto font-bold w-16 py-1 px-2">Assest Description</p>
                        </div>

                        <div className="w-[24%] text-center mx-1">
                            <p className="mx-auto font-bold w-16 py-1 px-2">Option</p>
                        </div>
                    </div>
                    <div className="bg-white  rounded-lg my-2">
                        {
                            portfoliodata && portfoliodata.map((data, index) => {
                                return (
                                    <div className="flex rounded items-center border-b-2 border-gray-300 px-5 py-5" key={data.id}>
                                        <div className="w-[75%]">
                                            <p className="text-lg font-semibold">{data.Assest_Title}</p>
                                        </div>
                                        <div className="w-[18%] md:w-32 text-center mx-1">
                                            <p className="text-lg font-bold">{data.Assest_Price}</p>
                                        </div>
                                        <div className="w-[18%] md:w-32 text-center mx-1">
                                            <p className="text-lg font-bold">{data.AType}</p>
                                        </div>

                                        <div className="w-[18%] md:w-32 text-center mx-1">
                                            <p className="text-lg font-bold">{data.Assest_Quantity}</p>
                                        </div>
                                        <div className="w-[18%] md:w-32 text-center mx-1">
                                            <p className="text-lg font-bold">{data.Assest_Description}</p>
                                        </div>
                                        <div className="w-[12%] text-center mx-1">
                                            <Link href="" onClick={() => {
                                                removeAssest(index)
                                            }} className="text-red-500 font-bold py-1 px-2">
                                                Delete
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        }

                    </div>
                    <Link href="/Portfolio/addAssest">Add Assest</Link>
                    <button onClick={addPortfolio}>Create Portfolio</button>

                </div>
            </div>
        </div>
        // </div >

    );
}

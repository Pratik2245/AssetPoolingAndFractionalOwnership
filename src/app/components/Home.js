"use client";
import react, { useState, useEffect } from "react";
import Slider from "./Slider";
import Link from "next/link";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";



const Home = () => {
  const [portfoliodata, setportfoliodata] = useState([]);
  const [dollarPrice, setDollarPrice] = useState(0);
  const router = useRouter();
  // useEffect(() => {
  //   allportfoliodata();
  // }, []);
  useEffect(() => {
    async function dollarconverter() {
      let Dollarprice = (await fetch("https://api.exchangerate-api.com/v4/latest/USD"));
      let price = await Dollarprice.json()
      setDollarPrice(price.rates["INR"])
    }
    dollarconverter()
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
        if (decoded.role == "user") {
          allportfoliodata();
        }
        if (decoded.role == "admin") {
          router.push('/dashboard/portfolios');
        }
      }
    }
  }, []);


  const allportfoliodata = async () => {
    // alert("calling ")
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}api/portfolio/TopPortfolio`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: "",
      }
    );
    const response = await res.json();
    console.log(response.error)
    console.log("completed");
    setportfoliodata(response.error);
  };
  return (
    <div className="flex flex-col justify-center items-center w-auto p-4 md:p-10 overflow-hidden">
      <div className="mx-auto w-full md:w-[60vw] h-auto">
        <Slider />
      </div>
      <div className="flex flex-wrap w-full justify-center items-center">
        <div className="text-center w-full my-2">
          <span className="text-white font-bold text-xl">Top</span>
        </div>
        {portfoliodata &&
          portfoliodata.map((elem, index) => {
            console.log(elem);
            if (index < 6) {
              return (
                <div key={index}>
                  {/* <div className="card" style={{ width: "18rem", color: "white", border: "1px solid red" }}>
									<div className="card-body">
										<h5 className="card-title"><Link key={index} href={`/Portfolio/PortfolioDetails?pid=${elem._id}`}>{elem.PortfolioName}</Link>
										</h5>
										<Link onClick={() => { Cookies.set("price", `${elem.Price}`) }} style={{ width: "10vh", color: "black" }} key={index} href={`/Portfolio/Assests/BuyAssest?pid=${elem._id}`}><div className="bg-white shadow-md rounded-lg max-w-sm m-2">
											buy
										</div>
										</Link>
									</div>
								</div> */}

                  <div className="bg-white shadow-md rounded-lg max-w-sm m-2">
                    <Link
                      key={index}
                      href={`/Portfolio/portfoliodetails?pid=${elem._id}`}
                    >
                      <h2 className="m-2 p-3 font-bold text-blue-600 text-3xl">
                        {elem.PortfolioName}
                      </h2>
                    </Link>
                    <div className="m-2 px-4 pb-4">
                      <p>
                      </p>

                      <div className="flex flex-wrap items-center justify-center my-2 mt-4">
                        <span className="text-sm font-bold m-2 px-2 py-2 rounded bg-orange-700 text-white">
                          Previous:₹{elem.PortfolioPrice && elem.PortfolioPrice[0].Price}
                          |${elem.PortfolioPrice && (elem.PortfolioPrice[0].Price / dollarPrice).toFixed(2)}
                        </span>
                        <span className="text-sm font-bold m-2 px-2 py-2 rounded bg-green-700 text-white">
                          Current:₹{elem.PortfolioPrice && elem.PortfolioPrice[0].Price}
                          |${elem.PortfolioPrice && (elem.PortfolioPrice[0].Price / dollarPrice).toFixed(2)}
                        </span>
                        <span className="text-sm font-bold m-2 px-2 py-2 rounded bg-pink-700 text-white">
                          Remaining:₹{Math.round(elem.RemainingPrice)}
                          |${((elem.RemainingPrice) / dollarPrice).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-center my-2 mt-4">
                        <Link
                          onClick={() => {
                            Cookies.set("price", `${elem.Price}`);
                          }}
                          href={`Portfolio/assests/buyassest?pid=${elem._id}`}
                        >
                          <p className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                            Buy
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

              );
            }
          })}
      </div>
    </div>
  );
};

export default Home;

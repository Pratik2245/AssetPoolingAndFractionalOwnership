"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import Web3 from "web3";
import APFOS from "../../../Portfolio/assests/buyassest/APFOS_Contract.json"
import Ethconverter from "@/app/EThconvert";

const Page = () => {
    const [myContract, setMyContract] = useState(null);
    const [transactionHash, setTransactionHash] = useState(null);
    const [web3, setweb3] = useState(null);
    const [UserPrice, setUserPrice] = useState(0);
    const [sender, setsender] = useState(null);
    const router = useRouter();
    let price = Cookies.get("price");
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }

        setContract();
        fetchEthereumPrice();
        Ethconverter();
    }, [])
    const handleAccountsChanged = async (accounts) => {
        setsender(accounts[0]); // Use the first account in the array
    };
    const fetchEthereumPrice = async () => {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
            const data = await response.json();
            return (data.ethereum.inr);
            // setEthPriceInINR(data.ethereum.inr);
        } catch (error) {
            console.error('Error fetching Ethereum price:', error);
        }
    }

    const setContract = async () => {
        try {
            let web3c = new Web3(window.ethereum)
            // console.log(a);
            setweb3(web3c);
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            console.log(accounts);
            setsender(accounts[0]); // Use the first account in the array
            const contractAddress = "0xB35753cE63e2125850519AC6fAE0548C4874D465";
            const myContractInstance = new web3c.eth.Contract(APFOS, contractAddress);
            console.log(myContractInstance)
            setMyContract(myContractInstance);

        } catch (error) {
            // alert("connect to network")
        }
    }
    const [data, setdata] = useState({
        useremail: "",
        BuyAmount: "",
        pid: "",
        PortfolioTotalPrice: "",
        Transactionid: null,
        Transactionamount: null,
        OrginalBuyPrice: ""

    });
    const onchange = (e) => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let portfolioid = urlParams.get('pid'); // value1

        let APFOS_useremail = localStorage.getItem("APFOS_useremail");
        let val = e.target.value;
        setdata({
            ...data,
            useremail: APFOS_useremail,
            BuyAmount: val,
            pid: portfolioid,
            PortfolioTotalPrice: price,
            OrginalBuyPrice: val
        });
    };
    const BuyAssest = async (e) => {
        e.preventDefault();
        if (!sender) {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

        }
        try {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            let portfolioid = urlParams.get('pid'); // value1
            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/portfolio/portfoliodetails`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pid: portfolioid,
                }),
            });
            const response = await res.json();
            if (response.error == null) {
                return alert("Invalid Transaction Attempt");
            }

            if (data.BuyAmount >= 1 && data.BuyAmount <= parseFloat(response.error.RemainingPrice)) {
                try {
                    const queryString = window.location.search;
                    const urlParams = new URLSearchParams(queryString);
                    let pid = urlParams.get('pid'); // value1

                    console.log(web3);

                    let p;
                    try {
                        p = await fetchEthereumPrice();
                    }
                    catch (error) {
                        return alert("check internet connection,try again");
                    }
                    const amountInEther = (parseFloat(data.BuyAmount) / parseFloat(p));
                    const gasEstimation = await myContract.methods
                        .orgdeposit(pid)
                        .estimateGas({
                            from: sender,
                            value: web3.utils.toWei(amountInEther.toString(), 'ether'),
                        });

                    console.log('Gas Estimation:', gasEstimation);


                    const result = await myContract.methods.orgdeposit(pid).send({
                        from: sender,
                        value: web3.utils.toWei(amountInEther.toString(), 'ether'),
                        gas: 100000
                    });

                    console.log(result);

                    setTransactionHash(result.transactionHash);
                    const withdrawfunds = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/portfolio/funddeposite`, {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ pid: pid, transactionHash: result.transactionHash, Amount: data.BuyAmount }),
                    });
                    let withdrawfunds1 = await withdrawfunds.json();
                    if (withdrawfunds1.status == 200) {
                        alert("fund transfer successfully");

                    }
                    else {
                        alert("falied")
                    }


                }
                catch (error) {
                    console.log(error)
                    return alert("Invalid Attempt\n reason:-\n 1.Check Metamask Is Installed \n 2.Check Metamask Address \n 3.Transaction is Cancelled");
                }
            } else {
                toast.error(`Enter Amount Between [${1}-${response.error.RemainingPrice}]`, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                return;
            }
        }
        catch (error) {
            alert(error.message);
        }
    }

    const handleSubmit = async (e, result, amountInEther) => {
        e.preventDefault();
        console.log(data);

        let url = window.location.href;
        let domain = new URL(url).hostname;
        let protocol = new URL(url).protocol;
        let port = new URL(url).port ? `:${new URL(url).port}` : '';
        let urlString = `${protocol}//${domain}${port}`;

        const res = await fetch(`${urlString}/api/portfolio/Assest/BuyAssest`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                useremail: data.useremail,
                BuyAmount: data.BuyAmount,
                pid: data.pid,
                PortfolioTotalPrice: data.PortfolioTotalPrice,
                OrginalBuyPrice: data.OrginalBuyPrice,
                Transactionid: result.transactionHash,
                Transactionamount: amountInEther,
            }),
        });
        const response = await res.json();
        console.log(response)
        if (response.status === 200) {
            toast.success("Asset Buy Successfully", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            Cookies.remove("price");
            router.push("/Portfolio/assests/buyassestlist");
        } else if (response.error == "Account Not Found") {
            toast.error("Account Not Found", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            router.push("/login");

        }
        else if (response.error == "Portfolio Not Found") {
            toast.error("Portfolio Not Found", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            router.push("/");

        }
        else if (response.status === 201) {
            toast.error("Invalid Format", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            router.push("/");
        }
        else {
            toast.error("Empty Field", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
        setdata({
            useremail: "",
            walletaddress: "",
        });


    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="mb-6 md:mb-0 flex flex-row justify-center my-2">
                <p className="text-2xl text-center text-white font-bold ml-3 bg-red-500 w-auto h-auto py-1 -2">
                    <span className=" bg-black text-white px-2 py-1">Bluechip</span> Art{" "}
                </p>
            </div>
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                        Transaction Page
                    </h1>

                    <form className="space-y-4 md:space-y-6" method="POST">
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 "
                            >
                                Enter Amount
                            </label>
                            <input
                                onChange={(e) => onchange(e)}
                                type="number"
                                name="BuyAmount"
                                id="BuyAmount"
                                className="bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="min:10rs"
                                required="true"
                            />
                        </div>

                        <button
                            onClick={(e) => BuyAssest(e)}
                            type="submit"
                            className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                        >
                            Add
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;

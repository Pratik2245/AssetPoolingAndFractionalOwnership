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
    const [cPortfolioPrice, setPortfolioPrice] = useState(0);
    const [sender, setsender] = useState(null);
    const router = useRouter();
    let price = Cookies.get("price");
    const portfolioOwnerChecker = async () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let portfolioid = urlParams.get('pid'); // value1

        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/portfolio/ownerChecker`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: localStorage.getItem("APFOS_useremail"),
                pid: portfolioid,
            }),
        });
        const response = await res.json();
        if (!response.error == "admin") {
            router.push("/");
        }

    }
    useEffect(() => {
        portfolioOwnerChecker();
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
        }
        setContract();
        // fetchEthereumPrice();
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
            alert("connect to network")
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
            const res1 = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/portfolio/funddetail`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pid: portfolioid }),
            });
            let response1 = await res1.json();

            // e.preventDefault();
            // alert(response.error.RemainingPrice);
            if (response.error == null) {
                return alert("Invalid Asset Purchase");
            }

            let p;
            let getContractbalanace = await myContract.methods.getBalance(portfolioid).call();
            console.log(getContractbalanace)
            try {
                p = await fetchEthereumPrice();
                console.log(p);
            }
            catch (error) {
                return alert("check internet connection,try again");
            }
            let diff;
            let transferAmount;
            let remamountInEther;
            let enteramount;
            let tA;
            let extraAmount = 0;
            // getContractbalanace = parseInt((getContractbalanace).toString().slice(0, -1));
            getContractbalanace = Number((getContractbalanace));
            getContractbalanace = (getContractbalanace / Math.pow(10, 18))


            if (response1.error == "Not Found") {

                console.log(getContractbalanace)
                // console.log(getContractbalanace)
                diff = ((response.error.Price - (response.error.RemainingPrice)) / 100) * 80;
                transferAmount = ((response.error.Price - (response.error.RemainingPrice)) / 100) * 20;

                console.log("diff" + diff);
                remamountInEther = (parseFloat(diff) / parseFloat(p));
                transferAmount = (parseFloat(transferAmount) / parseFloat(p));
                enteramount = data.BuyAmount / parseFloat(p);
                console.log("dififeth" + remamountInEther);
            }
            else {

                // getContractbalanace = Number((getContractbalanace));
                console.log(getContractbalanace)
                // getContractbalanace = (getContractbalanace / Math.pow(10, 18))
                console.log(getContractbalanace)
                diff = ((response.error.Price - (response.error.RemainingPrice)) / 100) * 80;
                transferAmount = ((response.error.Price - (response.error.RemainingPrice)) / 100) * 20;
                console.log("diff" + diff);
                remamountInEther = (parseFloat(diff) / parseFloat(p));
                transferAmount = (parseFloat(transferAmount) / parseFloat(p));
                enteramount = data.BuyAmount / parseFloat(p);
                extraAmount = response1.error.TotalAmount / parseFloat(p);
                alert(extraAmount);
                console.log("dififeth" + remamountInEther);
            }
            if ((getContractbalanace) > remamountInEther) {
                if (transferAmount > (enteramount + extraAmount)) {
                    try {
                        let APFOS_useremail = localStorage.getItem("APFOS_useremail");
                        const res1 = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/user/profile`, {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ Email: APFOS_useremail }),
                        });
                        let response1 = await res1.json();

                        const queryString = window.location.search;
                        const urlParams = new URLSearchParams(queryString);
                        let pid = urlParams.get('pid'); // value1
                        const amountInEther =
                            (parseFloat(data.BuyAmount) / parseFloat(p)) *
                            1000000000000000000;
                        console.log(amountInEther);

                        const accounts = await window.ethereum.request({
                            method: "eth_requestAccounts",
                        });
                        const sender = accounts[0];
                        // console.log(Deletedata._id);
                        const result = await myContract.methods
                            .withdraw(
                                response.error._id,
                                parseInt(amountInEther),
                                response1.error.metamaskaddress
                            )
                            .send({
                                from: sender,
                                gas: 90000,
                            });
                        const withdrawfunds = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/portfolio/fundwithdraw`, {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ pid: pid, transactionHash: "456789", Amount: data.BuyAmount }),
                        });
                        let withdrawfunds1 = await withdrawfunds.json();
                        if (withdrawfunds1.status == 200) {
                            alert(result);

                        }
                        else {
                            falied
                        }

                    }
                    catch (error) {
                        console.log(error)
                        return alert("Invalid Attempt\n reason:-\n 1.Check Metamask Is Installed \n 2.Check Metamask Address \n 3.Transaction is Cancelled");
                    }

                }
                else {
                    alert("insuffiecent balanace")
                }
            } else {
                toast.error(`Enter Amount Between [${1}-${tA + extraAmount}]`, {
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
            console.log(error)
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

'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwt_decode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultimage from "../../images/defaultprofile.jpg"
var jwt = require('jsonwebtoken');


const profile = () => {
    const router = useRouter();
    const [UserData, setUserData] = useState(null);
    const [message, setmessage] = useState("");
    const [img, setimg] = useState("");

    const [user, setuser] = useState({
        name: "",
        email: "",
        address: "",
        waddress: "",
        phone: "",
        pincode: "",
    })
    function isValidMetamaskAddress(address) {
        // Define the pattern for a valid Metamask address
        const addressPattern = /^(0x)?[0-9a-fA-F]{40}$/;

        // Test if the address matches the pattern
        return addressPattern.test(address);
    }



    const userData = async () => {
        setimg(defaultimage.src);
        const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/user/profile`, {
            method: "POST",
            headers: {
                Accept: "Application/json",
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({ Email: localStorage.getItem("APFOS_useremail") })
        })

        const response = await res.json();
        setuser({ name: response.error.name, email: response.error.email, phone: response.error.phone, waddress: response.error.metamaskaddress,address:response.error.address,pincode:response.error.pincode })
        setimg(response.error.pic)
        console.log(response.error);
        setUserData(response.error);
    }
    const handlePic = async (e) => {
        const filedata = e.target.files[0];
        console.log(e.target.files[0])
        const data = new FormData();
        data.append("file", filedata);
        data.append("upload_preset", "gsceswka");
        data.append("cloud_name", "dge7wv4zo");

        await fetch("https://api.cloudinary.com/v1_1/dge7wv4zo/image/upload", {
            method: "post",
            body: data
        })
            .then((res) => {
                res.json().then((data) => {
                    console.log(data);
                    setimg(data.url);
                })
            }).catch((error) => {
                console.log(error);
            })
    }
    const isFormValid = () => {
        // Add validation logic for each field
        if (!user.name || !user.email || !user.address || !user.phone || !user.pincode || !user.waddress) {
            console.log(user);
            toast.error("Please fill in all the fields!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return false;
        }


        return true;
    }
    useEffect(() => {
        userData();
        // if (localStorage.getItem('token')) {
        //     let decoded = jwt_decode(localStorage.getItem('token'));

        //     if (decoded.exp < Math.floor(Date.now() / 1000)) {
        //         localStorage.removeItem('token')
        //         console.log('expired')
        //         router.push("/login")
        //     }
        // }
        // else{
        //   router.push("/")
        // }
    }, []);

    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        if (name == "waddress") {
            if (isValidMetamaskAddress(value)) {
                setmessage("");
            } else {
                console.log("Invalid Metamask address!");
                setmessage("Invalid Metamask address!");
            }
        }
        setuser({ ...user, [name]: value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            return false;
        }
        else {
            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/user/updateProfile`, {
                method: "POST",
                headers: {
                    Accept: "Application/json",
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify({ user, pic: img })
            })

            const response = await res.json();
            if (response.status === 200) {
                toast.success("Details saved Successful", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } else if (response.status === 201) {
                toast.error("Comfirm password does not match", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } else if (response.status === 202) {
                toast.error("Please fill all the details", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } else {
                toast.error("Failed to Save.Try again..", {
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
        }
    }

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <input
                type="file"
                onChange={handlePic}
                id="pic"
                style={{ display: "none" }}
                accept="image/*"  // This line restricts file selection to only image files
            />            <label htmlFor="pic">
                <img
                    style={{
                        background: "white",
                        width: "30vh",
                        height: "30vh",
                        margin: "auto",
                        left: "40%",
                        position: "relative",
                        textAlign: "center",
                        borderRadius: "50%",  // Added border-radius to make it circular
                    }}
                    className="inline-block"
                    src={img}
                    alt=""
                />

            </label>

            <div className="isolate bg-white p-6 lg:px-8 min-h-screen">
                <form method="POST" className="mx-auto max-w-xl ">
                    <div className="py-4">
                        <h3 className="text-3xl font-bold text-gray-900 sm:text-xl">
                            Personal Info:
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                                Name
                            </label>
                            <div className="mt-2.5">
                                <input
                                    onChange={handleChange}
                                    value={user.name}
                                    type="text"
                                    name="name"
                                    id="name"
                                    autoComplete="off"
                                    required="true"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="last-name"
                                className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                                Email (cannot be changed)
                            </label>
                            <div className="mt-2.5">
                                <input
                                    onChange={handleChange}
                                    value={user.email}
                                    type="email"
                                    name="email"
                                    id="email"
                                    required="true"
                                    disabled={true}
                                    autoComplete="off"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="company"
                                className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                                Address
                            </label>
                            <div className="mt-2.5">
                                <input
                                    onChange={handleChange}
                                    value={user.address}
                                    type="text"
                                    name="address"
                                    id="address"
                                    autoComplete="off"
                                    required="true"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                                Phone No.
                            </label>
                            <div className="mt-2.5">
                                <input
                                    onChange={handleChange}
                                    value={user.phone}
                                    type="number"
                                    name="phone"
                                    id="phone"
                                    autoComplete="off"
                                    required="true"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="pincode"
                                className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                                Pincode
                            </label>
                            <div className="mt-2.5">
                                <input
                                    onChange={handleChange}
                                    value={user.pincode}
                                    type="number"
                                    name="pincode"
                                    id="pincode"
                                    autoComplete="off"
                                    required="true"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label
                                htmlFor="company"
                                className="block text-sm font-semibold leading-6 text-gray-900"
                            >
                                Wallet Address
                            </label>
                            <div className="mt-2.5">
                                <input
                                    onChange={handleChange}
                                    value={user.waddress}
                                    type="text"
                                    name="waddress"
                                    id="waddress"
                                    autoComplete="off"
                                    required="true"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                                />
                                <h2 style={{ color: "red" }}>{message}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="block w-full rounded-md bg-pink-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default profile;
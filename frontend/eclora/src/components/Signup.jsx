import React, { useState } from "react";
import { useAuth } from "./UserContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const { setIsLoggedIn } = useAuth();
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        let newErrors = {};
        if (!fname.trim()) newErrors.fname = "First name is required";
        if (!lname.trim()) newErrors.lname = "Last name is required";
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Invalid email format";
        }
        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const response = await fetch("http://192.168.29.216:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fname, lname, email, password }),
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok) {
                setIsLoggedIn(true);
                navigate("/");
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Signup error:", error);
        }
        setLoading(false);
    };

    return (
        <div className="w-full h-screen flex justify-center items-center bg-gray-100 p-4">
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-lg h-auto min-h-[60vh] sm:min-h-[70vh] border border-gray-300 bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-center border-b pb-3 mb-5">
                    <h1 className="text-2xl font-bold text-gray-700">Eclora</h1>
                </div>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <label className="text-gray-600 font-medium">First Name</label>
                    <input type="text" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" placeholder="Enter your first name" value={fname} onChange={(e) => setFname(e.target.value)} />
                    {errors.fname && <p className="text-red-500 text-sm">{errors.fname}</p>}

                    <label className="text-gray-600 font-medium">Last Name</label>
                    <input type="text" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" placeholder="Enter your last name" value={lname} onChange={(e) => setLname(e.target.value)} />
                    {errors.lname && <p className="text-red-500 text-sm">{errors.lname}</p>}

                    <label className="text-gray-600 font-medium">Email</label>
                    <input type="email" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    <label className="text-gray-600 font-medium">Password</label>
                    <input type="password" className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                    <button type="submit" className="mt-4 bg-black text-white py-2 rounded-md hover:bg-blue-700 transition" disabled={loading}>
                        {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span> : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;

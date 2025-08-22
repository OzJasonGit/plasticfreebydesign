"use client";

import styles from './sign_up.module.css';
import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Subfooter2 from "@/components/Subfooter2/subfooter2";
import { Button } from "@/components/ui/button"
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Menu from "../../components/Menu/menu";
import Sides from "../../components/Sides/sides";
import Cookies from "js-cookie"; // Import js-cookie for handling cookies

const Signup = () => {
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/signup", formData);

      if (data.error) {
        toast.error(data.error?.message || "Something went wrong!");
      } else {
        toast.success("Registered Successfully!");

        // Set token using the new simplified system
        // Store in both localStorage and cookies for consistency
        localStorage.setItem("token", data.token);
        document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        
        console.log('Sign-up: Token stored successfully');
        console.log('Token value:', data.token);
        console.log('User role:', data.user?.role);
        console.log('All cookies after setting:', document.cookie);
        
        // Dispatch custom event to notify header of login
        window.dispatchEvent(new CustomEvent('userLogin'));
        
        // Also call the global refresh function if available
        if (window.refreshHeaderAuth) {
          setTimeout(() => {
            window.refreshHeaderAuth();
          }, 500);
        }
        
        setTimeout(()=>(
          router.push("/")
        ),1500)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed!");
      console.log("Signup failed!", error);
    } finally {
      setIsLoading(false);
    }
  };

  const googleSuccess = async (res) => {
    try {
      const { credential } = res;
      const response = await axios.post("/api/google_login", {
        token: credential,
      });

      const { user, token } = response.data;

      // Store token using the new simplified system
      // Store in both localStorage and cookies for consistency
      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      
      console.log('Google sign-in: Token stored successfully');
      console.log('Token value:', token);
      console.log('User role:', user?.role);
      console.log('All cookies after setting:', document.cookie);
      
      // Store in localStorage
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("profile", JSON.stringify({ user, token }));
      }

      // Dispatch custom event to notify header of login
      window.dispatchEvent(new CustomEvent('userLogin'));

      toast.success("Google Login Successful!");
      router.push("/"); 
    } catch (error) {
      toast.error("Google Login Failed!");
    }
  };

  return (
    <>
      {/* <Menu/> */}
      <Header/>
      <Sides/>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <section id={styles.SHADOW_SECTION_BLOG} className={styles.center_holder}>
        <div className={styles.grid_0_blogimageholder}>
          <div id={styles.SIGN_UP}>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>

              <div className={`${isLoading && "flex justify-center items-center"}`}>
                {isLoading ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <>
                    <h2 id={styles._H2} className="text-left text-stone-400 font-avant_garde_bold">Sign Up</h2>

                    <form onSubmit={handleSubmit}>
                      {["firstName", "lastName", "email", "password", "confirmPassword"].map((field) => (
                        <div key={field} className="mb-4">
                          <label htmlFor={field} className="text-left text-stone-400 font-avant_garde_bold" id={styles._H3}>
                            {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                          </label>

                          <input
                            type={field.includes("password") ? "password" : "text"}
                            id={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="mt-1 border rounded-md"
                            required
                            style={{ width: "100%", height: "65px", padding: "20px" }}
                          />
                        </div>
                      ))}

                      <Button id={styles.FORM_BUTTON} type="submit" disabled={isLoading}>
                        Sign Up!
                      </Button>
                    </form>

                    <div className="mt-4 w-full flex justify-center" id={styles.GOOGLE_BUTTON}>
                      <GoogleLogin onSuccess={googleSuccess} onError={() => toast.error("Google Login Failed!")} />
                    </div>
                  </>
                )}
              </div>
            </GoogleOAuthProvider>
          </div>
        </div>
      </section>

      <Subfooter2/>
      <Footer/>
    </>
  );
};

export default Signup;

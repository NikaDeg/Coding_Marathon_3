import { useState } from "react";
import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsAuthenticated }) => {
    const navigate = useNavigate()

    const name = useField("text")
    const username = useField("text")
    const password = useField("password")
    const phone_number = useField("text")
    const license_number = useField("text")
    const date_of_birth = useField("date")
    const licenseExpiryDate = useField("date")
    const city = useField("text")
    const yearsOfExperience = useField("number")

    const { signup, error } = useSignup("/api/users/signup")

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        await signup({
            name: name.value,
            username: username.value,
            password: password.value,
            phone_number: phone_number.value,
            license_number: license_number.value,
            date_of_birth: date_of_birth.value,
            licenseExpiryDate: licenseExpiryDate.value,
            city: city.value,
            yearsOfExperience: yearsOfExperience.value
        })

        if (!error) {
            console.log("success")
            setIsAuthenticated(true)
            navigate("/")
        }
    }

    return(
        <div className="create">
            <h2>Sign Up</h2>
            <form onSubmit={handleFormSubmit}>
                <label>Name:</label>
                <input {...name}/>
                <label>Username:</label>
                <input {...username}/>
                <label>Password:</label>
                <input {...password}/>
                <label>Phone Number:</label>
                <input {...phone_number}/>
                <label>License Number:</label>
                <input {...license_number}/>
                <label>Date of Birth:</label>
                <input {...date_of_birth}/>
                <label>License Expiry Date:</label>
                <input {...licenseExpiryDate}/>
                <label>City:</label>
                <input {...city}/>
                <label>Years of Experience:</label>
                <input {...yearsOfExperience}/>
                <button>Sign up</button>
            </form>
        </div>
    )

}

export default Signup
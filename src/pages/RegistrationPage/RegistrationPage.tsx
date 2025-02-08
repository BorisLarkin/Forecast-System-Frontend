import React from "react";
import RegisterForm from "../../components/RegisterForm/RegisterForm.tsx";
import "./RegistrationPage.css";
import Header from "../../components/Header/Header.tsx";

const RegisterPage: React.FC = () => {
    return (
        <><Header></Header>
            <div className="body">
            <div className="register-page">
                <div className="container">
                    <RegisterForm/>
                </div>
            </div>
            </div>

        </>
    );
};

export default RegisterPage;
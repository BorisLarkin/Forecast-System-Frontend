import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/slices/regSlice.ts";
import { returnHeaderConfig, loginUserAsync } from "../../store/slices/userSlice.ts";
import { RootState, AppDispatch } from "../../store/store.ts";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";
import { ROUTES } from "../../Routes.tsx";

const RegisterForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()
    const { isLoading, error } = useSelector((state: RootState) => state.reg);

    const [formData, setFormData] = useState({
        login: "",
        password: "",
        repeat_password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.login && formData.password && formData.repeat_password){
            try{
                await dispatch(registerUser(formData));
                let req = {login: formData.login, password: formData.password, guest: false}
                await dispatch(loginUserAsync(req)); // Отправляем 'thunk'
                navigate(`${ROUTES.FORECASTS}`); // переход на страницу услуг
            }
            catch(error){
                console.log(error)
            }
        }
    };

    return (
        <div className="register-form">
            <form onSubmit={handleSubmit}>
                <h2>Регистрация</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <label htmlFor="login" className="form-label">
                        Логин
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="login"
                        name="login"
                        value={formData.login}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Пароль
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="repeat_password" className="form-label">
                        Повторите пароль
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="repeat_password"
                        name="repeat_password"
                        value={formData.repeat_password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
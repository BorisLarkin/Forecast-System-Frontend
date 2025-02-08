import React, { useState } from 'react';
import './ProfilePage.css';
import Header from "../../components/Header/Header.tsx";
import { AppDispatch, RootState } from '../../store/store.ts';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserAsync } from '../../store/slices/userSlice.ts';

const ProfilePage: React.FC = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const {
        role,
        uid,
        login,
        token
      } = useSelector((state: RootState) => state.user);
    
    const dispatch = useDispatch<AppDispatch>();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setError('Новые пароли не совпадают.');
            return;
        }
        if (!token) {
            setError('Токен авторизации отсутствует.');
            return;
        }
        dispatch(updateUserAsync({user_id: uid? uid : 0, login: login? login:'', password: formData.confirmPassword, role: role}))
            .then(() => {
                setSuccess('Данные успешно обновлены.');
                setError(null);
            })
            .catch(() => {
                setError('Ошибка при обновлении данных. Проверьте введённые данные.');
                setSuccess(null);
            });
    };

    return (
        <>
            <Header />
            <div className='body'>
            <div className="profile-page">
                <h1>Личный кабинет</h1>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Текущий пароль</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">Новый пароль</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Подтверждение нового пароля</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="submit-button">Сохранить изменения</button>
                </form>
            </div>
            </div>
        </>
    );
};

export default ProfilePage;
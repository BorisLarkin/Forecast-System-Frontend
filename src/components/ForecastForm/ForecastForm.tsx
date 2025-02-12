import React, { useState, useEffect } from 'react';
import './ForecastForm.css';
import { DsForecastRequest, DsForecastResponse } from '../../api/Api';

interface ForecastFormProps {
    initialData?: {
        forecast?: DsForecastResponse;
    };
    onSave: (data: { title: string; short: string; desc: string; ext: string; color: string; meas: string; image?: File }) => void;
    onCancel: () => void;
}

const ForecastForm: React.FC<ForecastFormProps> = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        color: '',
        descr: '',
        ext_desc: '',
        measure_type: '',
        short_title: '',
        title: '',
        image: null as File | null,
    });

    useEffect(() => {
        if (initialData?.forecast) {
            setFormData({
                color: initialData.forecast.color,
                descr: initialData.forecast.descr,
                ext_desc: initialData.forecast.ext_desc,
                measure_type: initialData.forecast.measure_type,
                short_title: initialData.forecast.short_title,
                title: initialData.forecast.title,
                image: null,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            color: formData.color,
            desc: formData.descr,
            ext: formData.ext_desc,
            meas: formData.measure_type,
            short: formData.short_title,
            title: formData.title,
            image: formData.image || undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="forecast-form">
            <div>
                <label>Название:</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Описание:</label>
                <textarea
                    name="descr"
                    value={formData.descr}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Краткое название:</label>
                <input
                    type="text"
                    name="short_title"
                    value={formData.short_title}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Ед. измерения:</label>
                <input
                    type="text"
                    name="measure_type"
                    value={formData.measure_type}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Цвет:</label>
                <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Расширенное описание:</label>
                <textarea
                    name="ext_desc"
                    value={formData.ext_desc}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Изображение:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">Сохранить</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Отмена</button>
            </div>
        </form>
    );
};

export default ForecastForm;
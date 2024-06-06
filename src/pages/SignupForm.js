import React, { useState } from 'react';
import './SignupForm.css'; // Importați fișierul CSS

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '', // Adăugați un câmp pentru confirmarea parolei
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Verificarea dacă parola și confirmarea parolei coincid
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Parola și confirmarea parolei nu coincid');
            }

            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Utilizator înregistrat:', data);
                alert('Înregistrare cu succes'); // Pop-up pentru succes
            } else {
                throw new Error('Failed to register user');
            }
        } catch (error) {
            console.error('Eroare la înregistrare:', error);
            alert('Eroare la înregistrare: ' + error.message); // Pop-up pentru eroare
        }
    };

    return (
        <form onSubmit={handleSubmit} className="signup-form">
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
            />
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
            />
            <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default SignupForm;

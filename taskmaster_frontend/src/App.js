// src/App.js
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import KanbanBoard from './components/KanbanBoard';
import RegisterForm from './components/RegisterForm';
import RecuperarContrasena from './components/RecuperarContrasena';
import ConfirmarRestablecimiento from './components/ConfirmarRestablecimiento';

function App() {
    const [token, setToken] = useState(null);

    return (
        <Routes>
            <Route path="/" element={<LoginForm setToken={setToken} />} />
            <Route path="/KanbanBoard" element={<KanbanBoard />} />
            <Route path="/registro" element={<RegisterForm setToken={setToken} />} /> {/* Nueva ruta de registro */}
            <Route path="/recuperar" element={<RecuperarContrasena />} />
            {/*<Route path="/api/auth/password-reset-confirm/:uidb64/:token" element={<ConfirmarRestablecimiento />} />*/}
            <Route path="/api/auth/password-reset-confirm/:uidb64/:token" element={<ConfirmarRestablecimiento />} />
        </Routes>
    );
}

export default App;




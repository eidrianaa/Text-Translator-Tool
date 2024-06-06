import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './pages/Home'; 
import Login from './pages/Login';
import Register from './pages/Register';
import TranslateForm from './pages/TranslateForm';
import Contact from './pages/Contact';
import History from './pages/History';

function App() {
    return (
        <BrowserRouter>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/translateform" element={<TranslateForm />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/history" element={<History />} />

                    {/* Alte rute necesare */}
                </Routes>
                {/* Alte componente necesare */}
            </div>
        </BrowserRouter>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
 
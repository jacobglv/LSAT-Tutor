import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { SessionProvider } from "./SessionContext";
import HomeTemplate from "./HomeTemplate";
import SessionTemplate from "./SessionTemplate";
import RegisterTemplate from "./RegisterTemplate";
import ChatTemplate from "./ChatTemplate";
import LoginTemplate from "./LoginTemplate";
import Nav from "./Nav";
import ProtectedRoute from "./components/ProtectedRoute";

function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />
}

function Register() {
    localStorage.clear();
    return <RegisterTemplate />
}

export default function App() {
    return (
        <SessionProvider>
            <Router>
                <NextUIProvider>
                        <Nav />
                        <Routes>
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <HomeTemplate />
                                </ProtectedRoute>
                                } />
                            <Route path="/session" element={
                                <ProtectedRoute>
                                    <SessionTemplate />
                                </ProtectedRoute>
                                } />
                            <Route path="/chat" element={
                                <ProtectedRoute>
                                    <ChatTemplate />
                                </ProtectedRoute>
                                } />
                            <Route path="/login" element={<LoginTemplate />} /> 
                            <Route path="/logout" element={<Logout />} /> 
                            <Route path="/register" element={<Register />} />
                        </Routes>
                </NextUIProvider>
            </Router>
        </SessionProvider>
    );
}

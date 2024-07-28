// src/SessionContext.js
import React, { createContext, useState, useEffect } from "react";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState('');
    const [goal, setGoal] = useState('');
    const [reflection, setReflection] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [isTimed, setIsTimed] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(null)
    const [name, setName] = useState('')
    const [lastGoal, setLastGoal] = useState('');
    const [lastReflection, setLastReflection] = useState('');
    const [user, setUser] = useState('');

    useEffect(() => {
        if (name != "") {
            localStorage.setItem('name', name); // persist name across react router
            localStorage.setItem('user', user);
        }
    }, [name]);

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const storedUser = localStorage.getItem('user');
        if (storedName) {
            setName(storedName);
        }
        if (user) {
            setUser(storedUser);
        }
        
    }, []);

    const logout = () => {
        setSession('');
        setGoal('');
        setReflection('');
        setNumberOfQuestions(0);
        setIsTimed(null);
        setIsAuthorized(null);
        setName('');
        setLastGoal('');
        setLastReflection('');
        setUser('');
        
        // Clear localStorage
        localStorage.removeItem('name');
        localStorage.removeItem('user');
    };

    return (
        <SessionContext.Provider value={{ name, setName, session, setSession, goal, setGoal, reflection, setReflection,
                                        isAuthorized, setIsAuthorized, numberOfQuestions, setNumberOfQuestions, isTimed, 
                                        setIsTimed, lastGoal, setLastGoal, lastReflection, setLastReflection, user, setUser,
                                        logout, }}>
            {children}
        </SessionContext.Provider>
    );
};

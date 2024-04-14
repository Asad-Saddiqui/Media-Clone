// MyContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context
const MyContext = createContext();

// Create a provider component
export const MyProvider = ({ children }) => {
    const [state, setState] = useState("Hello asad");
    const [datalength,setDatalength] = useState(0);
    const [notificationData, setnotificationData] = useState([]);

    return (
        <MyContext.Provider value={{ state, setState, datalength, setDatalength, notificationData, setnotificationData }}>
            {children}
        </MyContext.Provider>
    );
};

// Custom hook for using the context
export const useMyContext = () => {
    return useContext(MyContext);
};

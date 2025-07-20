import React, { createContext, useContext, useState } from 'react';

const AreaSelectedContext = createContext();
export const useAreaSelected = () => useContext(AreaSelectedContext); //this is a custom hook to use the context



export const AreaSelectedProvider = (props) => {
    const [cityContext, setCityContext] = useState('');
    const [universityContext, setUniversityContext] = useState('');

    return (
        <AreaSelectedContext.Provider value={{ cityContext, setCityContext, universityContext, setUniversityContext }}>
            {props.children}
        </AreaSelectedContext.Provider>
    );
};

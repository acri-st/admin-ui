import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './Flavors.css';
import { FlavorList } from './FlavorList/FlavorList';
import { CreateFlavor } from './CreateFlavor/CreateFlavor';
import { FlavorPage } from './FlavorPage/FlavorPage';
// import { FlavorPage } from './FlavorPage/FlavorPage';

export default () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<FlavorList/>}/>
                <Route path='/create' element={<CreateFlavor/>}/>
                <Route path='/:id' element={<FlavorPage/>}/>
            </Routes>
        </>
    );
};

import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './OperatingSystems.css';
import { OperatingSystemList } from './OperatingSystemList/OperatingSystemList';
import { CreateOperatingSystem } from './CreateOperatingSystem/CreateOperatingSystem';
import { OperatingSystemPage } from './OperatingSystemPage/OperatingSystemPage';
// import { OperatingSystemPage } from './OperatingSystemPage/OperatingSystemPage';

export default () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<OperatingSystemList/>}/>
                <Route path='/create' element={<CreateOperatingSystem/>}/>
                <Route path='/:id' element={<OperatingSystemPage/>}/>
            </Routes>
        </>
    );
};

import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './Applications.css';
import { ApplicationList } from './ApplicationList/ApplicationList';
import { ApplicationPage } from './ApplicationPage/ApplicationPage';
import { CreateApplication } from './CreateApplication/CreateApplication';

export default () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<ApplicationList/>}/>
                <Route path='/create' element={<CreateApplication/>}/>
                <Route path='/:id' element={<ApplicationPage/>}/>
            </Routes>
        </>
    );
};

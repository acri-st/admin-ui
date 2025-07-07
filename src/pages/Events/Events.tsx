import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './Events.css';
import { EventsList } from './EventsList/EventsList';
import { EventPage } from './EventPage/EventPage';

export default () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<EventsList/>}/>
                <Route path='/:id' element={<EventPage/>}/>
            </Routes>
        </>
    );
};

import React, { useCallback } from 'react';
import './Home.css'

import { NavLink } from 'react-router-dom';
import { collabAdminRoutes, hasRole, IAdminRoute, sandboxAdminRoutes } from '../../utils/routes';
import { ReduxState } from '../../redux';
import { useSelector } from 'react-redux';

export default () => {
    const { roles } = useSelector((state: ReduxState)=> state.auth);

    const checkRouteAvailable = useCallback((r: IAdminRoute)=>{
        return ( !r.roles || hasRole(r.roles, roles || []) )
    },[ roles ])

    return (
        <>
            <h1>Welcome to the admin UI</h1>
            <br/>
            <div id="home-navigation">
                {
                    collabAdminRoutes.some((r)=> checkRouteAvailable(r)) &&
                    <div className="home-navigation-section">
                        <h2>Collaborative</h2>
                        {
                            collabAdminRoutes.map((r, idx)=>(
                                <NavLink key={r.path} className="admin-home-navigation" to={r.link || r.path}>
                                    { r.label }
                                </NavLink>
                            ))
                        }                   
                    </div>
                }
                {
                    sandboxAdminRoutes.some((r)=> checkRouteAvailable(r)) &&
                    <div className="home-navigation-section">
                        <h2>Sandbox</h2>
                        {
                            sandboxAdminRoutes.map((r, idx)=>(
                                <NavLink key={r.path} className="admin-home-navigation" to={r.link || r.path}>
                                    { r.label }
                                </NavLink>
                            ))
                        }
                    </div>
                }

                {
                    !collabAdminRoutes.some((r)=> checkRouteAvailable(r)) 
                    && !sandboxAdminRoutes.some((r)=> checkRouteAvailable(r)) &&
                    <div className='no-data'>
                        You have no admin rights
                    </div>
                }

            </div>
        </>
    );
};

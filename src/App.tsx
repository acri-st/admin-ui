import React, { ReactNode, useCallback, useEffect, useState } from 'react';

import "@fontsource/roboto";
import './theme/app.css';
import './theme/app.css';
import '@desp-aas/desp-ui-fwk';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import { ReduxState } from './redux';
import { useDispatch, useSelector } from 'react-redux';
import { appInit, LoadingPage, NavigationMobileMenu, useUser, FWKIcons, Page, doLogin, doLogout } from "@desp-aas/desp-ui-fwk";
import { ToastContainer } from 'react-toastify';
import './App.css';
import Events from './pages/Events/Events';
import { NavLink } from 'react-router-dom';
import { baseAdminRoutes, collabAdminRoutes, hasRole, IAdminRoute, routes, sandboxAdminRoutes } from './utils/routes';

export default function App() {

    const dispatch = useDispatch()

    const [initialized, setInitialized] = useState(false);
    const {authChecked} = useSelector((state: ReduxState)=> state.auth );

    appInit(dispatch);

    const user = useUser();

    useEffect(() => {
        if(authChecked){
            setInitialized(true);
        }
    }, [authChecked])

    
    const { roles } = useSelector((state: ReduxState)=> state.auth);
    const checkRouteAvailable = useCallback((r: IAdminRoute)=>{
        return (
            !r.roles ||
            hasRole(r.roles, roles || [])
        )
    },[ roles ]);

    const [ navRoutes, setNavRoutes ] = useState(routes.filter((r)=> checkRouteAvailable(r) ))

    useEffect(()=>{
        setNavRoutes(routes.filter((r)=> checkRouteAvailable(r) ))
    }, [ roles ])

    return (
        <div
            id="app"
        >
            
            <ToastContainer
                position='bottom-right'
            />
            {
                !initialized 
                ?
                    <LoadingPage 
                        title={<>DESP Admin UI</>}
                    />
                :
                <Page 
                    id="main-page"
                    fixedHeight
                    withoutFooter
                    withoutRouter
                >
                    {
                        !user 
                        ?
                            <div id="admin-login">
                                <p>
                                    To access the admin section please
                                </p>
                                <div 
                                    className="button themed medium"
                                    onClick={doLogin}
                                >

                                    { FWKIcons.login } Login
                                </div>
                            </div>
                        :
                            <BrowserRouter>
                                <NavigationMobileMenu
                                    routes={navRoutes}
                                />
                                <div className="fixed-page-content">
                                    <div id="admin-navigation">
                                        {/* TITLE */}

                                        <div id="admin-nav-title">
                                            DESP Admin UI
                                        </div>

                                        {/* ADMIN ROUTES */}
                                        <div id="admin-routes">
                                            <AdminMenuRoutes
                                                routes={baseAdminRoutes}
                                            />
                                            <AdminMenuRoutes
                                                routes={collabAdminRoutes}
                                                sectionLabel={<>Collaborative</>}
                                            />
                                            <AdminMenuRoutes
                                                routes={sandboxAdminRoutes}
                                                sectionLabel={<>Sandbox</>}
                                            />
                                        </div>

                                        {/* ADMIN AUTH */}

                                        <div id="admin-auth">
                                            <div id="login-user">
                                                <div id="login-user-text">
                                                    Logged in as
                                                </div>
                                                <div id="login-user-username">
                                                    {user.displayName}
                                                </div>
                                            </div>
                                            <div 
                                                className="button red inverted small "
                                                onClick={doLogout}
                                            >
                                                { FWKIcons.logout } Logout
                                            </div>
                                        </div>

                                    </div>

                                    <div id="admin-content">
                                        <Routes>
                                            {
                                                navRoutes.map((r, idx)=>(
                                                    <Route key={r.path} path={r.path} element={r.element} />
                                                ))
                                            }
                                            <Route path="*" element={<Navigate to=""/>} />
                                        </Routes>
                                    </div>
                                </div>
                            </BrowserRouter>

                    }

                </Page>
            }
                
        </div>
    )
}

type IAdminMenuRoutesProps = {
    routes: IAdminRoute[]
    sectionLabel?: ReactNode 
    sectionName?: ReactNode 
}
export const AdminMenuRoutes = (props: IAdminMenuRoutesProps) =>{

    const { roles } = useSelector((state: ReduxState)=> state.auth);
    const checkRouteAvailable = useCallback((r: IAdminRoute)=>{
        return (
            !r.roles ||
            hasRole(r.roles, roles || [])
        )
    },[ roles ])
    const [ rolePresent ] = useState(props.routes.some((r)=> checkRouteAvailable(r)));

    if(!rolePresent) return null;

    return (
        <>
            {
                props.sectionLabel &&
                <h2>{props.sectionLabel}</h2>
            }
            {
                props.routes.map((r, idx)=>(
                    checkRouteAvailable(r) &&
                    <NavLink className="admin-route" key={r.path} end={r.exact} to={r.link || r.path}>{r.label}</NavLink>
                ))
            }
        </>
    )
}

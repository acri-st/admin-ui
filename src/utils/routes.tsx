import { ReactNode } from "react"
import Home from "../pages/Home/Home"
import Events from "../pages/Events/Events"
import Applications from "../pages/Applications/Applications"
import OperatingSystems from "../pages/OperatingSystems/OperatingSystems"
import Flavors from "../pages/Flavors/Flavors"

export type IAdminRoute = {
    id: string
    path: string
    exact?: boolean
    label: ReactNode
    element: ReactNode
    link?: string
    roles?: string[]
}

export const hasRole = (roles: string | string[], userRoles: string[]) => (typeof roles === 'string' ? [roles]: roles ).some((r)=> userRoles.includes(r) );  

export const baseAdminRoutes: IAdminRoute[] = [
    { id: "home", path: '/',  exact: true, label: <>Home</>, element: <Home /> },
]

export const collabAdminRoutes: IAdminRoute[] = [
    { id: "moderation", path: '/moderation/*',  link: '/moderation', label: <>Moderation</>, element: <Events/>, roles: ["moderator"] },
]
export const sandboxAdminRoutes: IAdminRoute[] = [
    { id: "applications", path: '/applications/*',  link: '/applications', label: <>Applications</>, element: <Applications/>, roles: ["admin"] },
    { id: "operating-systems", path: '/operating-systems/*',  link: '/operating-systems', label: <>Operating systems</>, element: <OperatingSystems/>, roles: ["admin"] },
    { id: "flavors", path: '/flavors/*',  link: '/flavors', label: <>Flavors</>, element: <Flavors/>, roles: ["admin"] },
]

export const routes: IAdminRoute[] = [
    ...baseAdminRoutes,
    ...collabAdminRoutes,
    ...sandboxAdminRoutes,
]


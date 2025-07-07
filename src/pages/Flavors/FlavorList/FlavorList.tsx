import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './FlavorList.css';
import { NavLink } from 'react-router-dom';
import { icons } from '../../../utils/icons';
import { confirm, deleteFlavor, getFlavors, handleRequestError, IFlavor } from '@desp-aas/desp-ui-fwk';



export const FlavorList = () => {
    const [flavorss, setFlavors] = useState<IFlavor[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        fetch()
    }, [ ])


    const fetch = useCallback(() => {
        setLoading(true)
        getFlavors()
        .then((response)=>{
            setFlavors(response)
        })
        .catch(handleRequestError)
        .finally(()=>{
            setLoading(false)
        })
    }, [ ]);

    const handleDelete = useCallback((flavors: IFlavor)=>{
        confirm({
            title: "Delete flavor",
            message: `Are you sure you want to delete ${flavors.name}?`,
            onConfirm: ()=>{
                deleteFlavor(flavors.id)
                .then(()=>{
                    toast(<>Successfully removed flavor {flavors.name}</>, { type: 'success' })
                    fetch()
                })
                .catch((e)=>{
                    handleRequestError(e);
                })
            }
        })
    }, [ ])

    return (
        <>
            <h1>Flavors</h1>
            <NavLink className="button green inverted" to={`/flavors/create`}>
                { icons.create } Create
            </NavLink>

            <div id="flavors-list">
                {
                    loading
                    ? <div className="no-data">Loading flavors...</div>
                    : flavorss?.map((os)=>(
                        <div className='flavor-item'  key={os.id}>
                            <NavLink to={`/flavors/${os.id}`}>
                                <FlavorCard flavors={os}/>
                            </NavLink>
                            <div 
                                id="delete-flavor"
                                className="button red operation icon-only"
                                onClick={(ev)=> {ev.stopPropagation(); handleDelete(os)}}
                            >
                                { icons.delete }
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );
};


const FlavorCard = (props:{
    flavors: IFlavor
}) =>{
    return (
        <div className="flavor-card" >
            <div className="flavor-card-content">
                <div className="flavor-card-name">
                    { props.flavors.name }
                </div>
            </div>
        </div>
    )
}
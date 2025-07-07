import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import './FlavorPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { icons } from '../../../utils/icons';
import { NavLink } from 'react-router-dom';
import { getFlavor, handleRequestError, IFlavor, IFlavorForm, updateFlavor } from '@desp-aas/desp-ui-fwk';
import { FlavorForm } from '../FlavorForm/FlavorForm';


export const FlavorPage = () => {
    const { id } = useParams() as { id: string };
    const navigate = useNavigate();

    const [flavor, setFlavor] = useState<IFlavor|undefined>();
    const [updates, setUpdates] = useState<Partial<IFlavorForm>>({});
    const [loading, setLoading] = useState(false);

    const [updating, setUpdating] = useState(false);
    const [ updatesPresent, setUpdatesPresent ] = useState(false)
    const [ ready, setReady ] = useState(false);

    useEffect(()=>{
        fetch(true)
    }, [ id ])


    useEffect(()=>{
        setReady(
            ( 'name' in updates ? !!updates.name : true )
        )
    }, [ updates ])

    useEffect(()=>{
        setUpdatesPresent(Object.keys(updates).length > 0)
    }, [ updates ])

    const fetch = useCallback((withLoading?: boolean) => {
        if(withLoading) setLoading(true)
        getFlavor(id)
        .then((response)=>{ 
            setFlavor(response)
        })
        .catch((err)=>{
            handleRequestError(err);
            navigate('/flavors')
        })
        .finally(()=>{
            if(withLoading) setLoading(false)
        })
    }, [ id ]);


    const update = (newUpdates: Partial<IFlavorForm>) =>{
        let _updates = {
            ...updates,
            ...newUpdates
        }
        Object.entries(_updates).map(([k, v])=>{
            if(
                v === undefined 
                || ( Array.isArray(v) && v.length === 0 )
                || v === (flavor as any)[k]
            ) delete (_updates as any)[k];
        })
        setUpdates(_updates)
    }

    const updateCallback = useCallback(()=>{
        if(updatesPresent){
            setUpdating(true)
            updateFlavor(id, updates as IFlavor)
            .then(()=>{
                toast(<>Updated flavor {updates.name}</>, { type: 'success' })
                fetch();
                setUpdates({})
            })
            .catch((err)=>{
                handleRequestError(err)
            })
            .finally(()=>{
                setUpdating(false)
            })
        }
    }, [ updates, updatesPresent ])

    return (
        <>
            <h1>Flavor {flavor?.name}</h1>
            <NavLink className="button small themed" to={"/flavors"}>
                {"<<"} back to flavors
            </NavLink>
            <br/>
            <div id="flavor-page" className="scroll-content">

                {
                    loading
                    ?
                        <div className="no-data">Loading...</div>
                    :
                        flavor &&
                        <FlavorForm
                            flavor={flavor}
                            form={updates}
                            onChange={update}
                        />
                }
            </div>

            <div className="operation-bar">
                <div 
                    className={classNames({
                        "button blue inverted medium": true,
                        "disabled": !updatesPresent || updating || !ready
                    })}
                    onClick={updateCallback}
                >
                    { icons.update } { updating ? 'Updating...' : 'Update'  }
                </div>
            </div>
               

        </>
    );
};

import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import './OperatingSystemPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { icons } from '../../../utils/icons';
import { NavLink } from 'react-router-dom';
import { getOperatingSystem, handleRequestError, IOperatingSystem, IOperatingSystemForm, updateOperatingSystem } from '@desp-aas/desp-ui-fwk';
import { OperatingSystemForm } from '../OperatingSystemForm/OperatingSystemForm';


export const OperatingSystemPage = () => {
    const { id } = useParams() as { id: string };
    const navigate = useNavigate();

    const [operatingSystem, setOperatingSystem] = useState<IOperatingSystem|undefined>();
    const [updates, setUpdates] = useState<Partial<IOperatingSystemForm>>({});
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
        getOperatingSystem(id)
        .then((response)=>{ 
            setOperatingSystem(response)
        })
        .catch((err)=>{
            handleRequestError(err);
            navigate('/operating-systems')
        })
        .finally(()=>{
            if(withLoading) setLoading(false)
        })
    }, [ id ]);


    const update = (newUpdates: Partial<IOperatingSystemForm>) =>{
        let _updates = {
            ...updates,
            ...newUpdates
        }
        Object.entries(_updates).map(([k, v])=>{
            if(
                v === undefined 
                || ( Array.isArray(v) && v.length === 0 )
                || v === (operatingSystem as any)[k]
            ) delete (_updates as any)[k];
        })
        setUpdates(_updates)
    }

    const updateCallback = useCallback(()=>{
        if(updatesPresent){
            setUpdating(true)
            updateOperatingSystem(id, updates as IOperatingSystem)
            .then(()=>{
                toast(<>Updated operatingSystem {updates.name}</>, { type: 'success' })
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
            <h1>Operating system {operatingSystem?.name}</h1>
            <NavLink className="button small themed" to={"/operating-systems"}>
                {"<<"} back to operating systems
            </NavLink>
            <br/>
            <div id="operatingSystem-page" className="scroll-content">

                {
                    loading
                    ?
                        <div className="no-data">Loading...</div>
                    :
                        operatingSystem &&
                        <OperatingSystemForm
                            operating_system={operatingSystem}
                            form={updates}
                            onChange={update}
                            updateApplication={fetch}
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

import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './OperatingSystemList.css';
import { NavLink } from 'react-router-dom';
import { icons } from '../../../utils/icons';
import { Checkbox, confirm, deleteOperatingSystem, getOperatingSystems, handleRequestError, hexToImage, IOperatingSystem } from '@desp-aas/desp-ui-fwk';



export const OperatingSystemList = () => {
    const [operatingSystems, setOperatingSystems] = useState<IOperatingSystem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        fetch()
    }, [ ])


    const fetch = useCallback(() => {
        setLoading(true)
        getOperatingSystems()
        .then((response)=>{
            setOperatingSystems(response)
        })
        .catch(handleRequestError)
        .finally(()=>{
            setLoading(false)
        })
    }, [ ]);

    const handleDelete = useCallback((operatingSystem: IOperatingSystem)=>{
        confirm({
            title: "Delete operating system",
            message: `Are you sure you want to delete ${operatingSystem.name}?`,
            onConfirm: ()=>{
                deleteOperatingSystem(operatingSystem.id)
                .then(()=>{
                    toast(<>Successfully removed operating system {operatingSystem.name}</>, { type: 'success' })
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
            <h1>Operating systems</h1>
            <NavLink className="button green inverted" to={`/operating-systems/create`}>
                { icons.create } Create
            </NavLink>

            <div id="operating-systems-list">
                {
                    loading
                    ? <div className="no-data">Loading operating systems...</div>
                    : operatingSystems?.map((os)=>(
                        <div className='operating-system-item'  key={os.id}>
                            <NavLink to={`/operating-systems/${os.id}`}>
                                <OperatingSystemCard operatingSystem={os}/>
                            </NavLink>
                            <div 
                                id="delete-operating-system"
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


const OperatingSystemCard = (props:{
    operatingSystem: IOperatingSystem
}) =>{
    return (
        <div className="operating-system-card" >
            <div className="operating-system-card-content">
                <div className="operating-system-card-name">
                    { props.operatingSystem.name }
                </div>
                <div className="operating-system-card-gui">
                    { 
                        props.operatingSystem.is_gui 
                        ? <>Has GUI <Checkbox checked/></>
                        : <>No GUI <Checkbox/></>
                    }
                </div>
            </div>
        </div>
    )
}
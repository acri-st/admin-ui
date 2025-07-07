import { NavLink, useNavigate } from 'react-router-dom';
import './CreateOperatingSystem.css';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { icons } from '../../../utils/icons';
import { toast } from 'react-toastify';
import { createOperatingSystem, handleRequestError, IOperatingSystemForm } from '@desp-aas/desp-ui-fwk';
import { OperatingSystemForm } from '../OperatingSystemForm/OperatingSystemForm';


const defaultForm = (): IOperatingSystemForm =>{
    return { name: '', is_gui: false };
}

export const CreateOperatingSystem = () =>{
    const [ form, setForm ] = useState<IOperatingSystemForm>(defaultForm());
    const [ ready, setReady ] = useState(false);
    const [ creating, setCreating ] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        setReady(
            !!form.name 
            // && form.icon !== undefined
        )
    }, [ form ])

    const updateForm = useCallback((updates: Partial<IOperatingSystemForm>) =>{
        setForm({
            ...form,
            ...updates
        })
    }, [ form ])

    
    const create = useCallback(()=>{
        if(ready){
            setCreating(true)
            createOperatingSystem(form)
            .then(()=>{
                toast(<>Created operating system {form.name}</>, { type: 'success' })
                navigate(`/operating-systems`)
            })
            .catch((err)=>{
                handleRequestError(err)
            })
            .finally(()=>{
                setCreating(false)
            })
        }
    }, [ form, ready ])

    return (
        <>
            <h1>Create Operating system</h1>
            <NavLink className="button small themed" to={"/operating-systems"}>
                {"<<"} back to operating systems
            </NavLink>
            
            <div className="scroll-content operating-system-form-container">
                <OperatingSystemForm
                    form={form}
                    onChange={updateForm}
                />
            </div>

            <div className="operating-system-form-buttons operation-bar">
                <div
                    className={classNames({
                        "button green inverted medium": true,
                        "disabled": !ready || creating
                    })}
                    onClick={create}
                >
                    { icons.create } { creating ? 'Creating...' : 'Create' }
                </div>
            </div>
        </>
    )
}
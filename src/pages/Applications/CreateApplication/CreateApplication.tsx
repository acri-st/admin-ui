import { NavLink, useNavigate } from 'react-router-dom';
import './CreateApplication.css';
import { ApplicationForm } from '../ApplicationForm/ApplicationForm';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { icons } from '../../../utils/icons';
import { toast } from 'react-toastify';
import { createApplication, handleRequestError, IApplicationForm } from '@desp-aas/desp-ui-fwk';


const defaultForm = (): Partial<IApplicationForm> =>{
    return { name: '', description: '' };
}

export const CreateApplication = () =>{
    const [ form, setForm ] = useState<IApplicationForm>(defaultForm());
    const [ ready, setReady ] = useState(false);
    const [ creating, setCreating ] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        setReady(
            !!form.name && !!form.description 
            // && form.icon !== undefined
        )
    }, [ form ])

    const updateForm = useCallback((updates: Partial<IApplicationForm>) =>{
        setForm({
            ...form,
            ...updates
        })
    }, [ form ])

    
    const create = useCallback(()=>{
        if(ready){
            setCreating(true)
            createApplication(form)
            .then(()=>{
                toast(<>Created application {form.name}</>, { type: 'success' })
                navigate(`/applications`)
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
            <h1>Create Application</h1>
            <NavLink className="button small themed" to={"/applications"}>
                {"<<"} back to applications
            </NavLink>
            
            <div className="scroll-content application-form-container">
                <ApplicationForm
                    form={form}
                    onChange={updateForm}
                />
            </div>

            <div className="application-form-buttons operation-bar">
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
import { NavLink, useNavigate } from 'react-router-dom';
import './CreateFlavor.css';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { icons } from '../../../utils/icons';
import { toast } from 'react-toastify';
import { createFlavor, handleRequestError, IFlavorForm } from '@desp-aas/desp-ui-fwk';
import { FlavorForm } from '../FlavorForm/FlavorForm';


const defaultForm = (): IFlavorForm =>{
    return {
        name: "",

        processor: "", 
        storage: "",
        gpu: "",

        bandwidth: "", 
        memory: "", 
        price: "", 

        openstack_flavor_id: "",
    };
}

export const CreateFlavor = () =>{
    const [ form, setForm ] = useState<IFlavorForm>(defaultForm());
    const [ ready, setReady ] = useState(false);
    const [ creating, setCreating ] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        setReady(
            [ 
                "processor" ,
                "storage",
                "bandwidth" ,
                "memory" ,
                "price",
                "openstack_flavor_id"
            ].every((col)=> !!(form as any)[col] )
            // && form.icon !== undefined
        )
    }, [ form ])

    const updateForm = useCallback((updates: Partial<IFlavorForm>) =>{
        setForm({
            ...form,
            ...updates
        })
    }, [ form ])

    
    const create = useCallback(()=>{
        if(ready){
            setCreating(true)
            createFlavor(form)
            .then(()=>{
                toast(<>Created operating system {form.name}</>, { type: 'success' })
                navigate(`/flavors`)
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
            <NavLink className="button small themed" to={"/flavors"}>
                {"<<"} back to flavors
            </NavLink>
            
            <div className="scroll-content flavor-form-container">
                <FlavorForm
                    form={form}
                    onChange={updateForm}
                />
            </div>

            <div className="flavor-form-buttons operation-bar">
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
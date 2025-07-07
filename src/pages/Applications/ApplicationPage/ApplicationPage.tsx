import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import './ApplicationPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { icons } from '../../../utils/icons';
import { NavLink } from 'react-router-dom';
import { ApplicationForm } from '../ApplicationForm/ApplicationForm';
import { createApplicationOperatingSystem, FormField, getApplication, getOperatingSystems, handleRequestError, IApplication, IApplicationForm, IApplicationOperationSystem, IApplicationOperationSystemForm, IOperatingSystem, Select, updateApplication, updateApplicationOperatingSystem } from '@desp-aas/desp-ui-fwk';


export const ApplicationPage = () => {
    const { id } = useParams() as { id: string };
    const navigate = useNavigate();

    const [application, setApplication] = useState<IApplication|undefined>();
    const [updates, setUpdates] = useState<IApplicationForm>({});
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
            && ( 'description' in updates ? !!updates.description : true )
        )
    }, [ updates ])

    useEffect(()=>{
        setUpdatesPresent(Object.keys(updates).length > 0)
    }, [ updates ])

    const fetch = useCallback((withLoading?: boolean) => {
        if(withLoading) setLoading(true)
        getApplication(id)
        .then((response)=>{
            setApplication({...response, 
                // operation_systems: [
                //     {
                //         application: '',
                //         operating_system: dummyOS.ubuntu1,
                //         script: '/bin/bash -c "apt get install pytorch"',
                //     },
                //     {
                //         application: '',
                //         operating_system: dummyOS.rocky2,
                //         script: 'pip install --upgrade tensorflow && python -c "import tensorflow as tf; print(tf.__version__)"',
                //     }
                // ]
            })
            
            setAppOperatingSystem(response.available_operatingsystems?.[0])
        })
        .catch((err)=>{
            handleRequestError(err);
            navigate('/applications')
        })
        .finally(()=>{
            if(withLoading) setLoading(false)
        })
    }, [ id ]);


    const update = (newUpdates: Partial<IApplicationForm>) =>{
        let _updates = {
            ...updates,
            ...newUpdates
        }
        Object.entries(_updates).map(([k, v])=>{
            if(
                v === undefined 
                || ( Array.isArray(v) && v.length === 0 )
                || v === (application as any)[k]
            ) delete (_updates as any)[k];
        })
        setUpdates(_updates)
    }

    const updateCallback = useCallback(()=>{
        if(updatesPresent){
            setUpdating(true)
            updateApplication(id, updates)
            .then(()=>{
                toast(<>Updated application {updates.name}</>, { type: 'success' })
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

    
    const [ appOperatingSystem, setAppOperatingSystem ] = useState<IApplicationOperationSystem|undefined>();
    const [ selectedOs, setSelectedOS ] = useState<string|undefined>();

    const [ operatingSystems, setOperatingSystems ] = useState<IOperatingSystem[]>([]);
    const [ operatingSystemsRemaining, setOperatingSystemsRemaining ] = useState<IOperatingSystem[]>([]);

    useEffect(()=>{
        getOperatingSystems()
        .then((response)=>{
            setOperatingSystems(response)
        })
        .catch(handleRequestError)
    }, [  ])
    
    useEffect(()=>{
        if(!application){
            setOperatingSystemsRemaining([])
        }
        else{
            let currentOs = application.available_operatingsystems?.map((os)=> os.id )
            console.log("currentOs", currentOs);
            console.log("operatingSystems", operatingSystems);
            let remaining = (currentOs && currentOs.length > 0) ? operatingSystems.filter((os)=> !currentOs.includes(os.id) ) : operatingSystems;
            console.log("remaining", remaining);
            setOperatingSystemsRemaining(remaining)
        }
    }, [ operatingSystems, application ])

    return (
        <>
            <h1>Application {application?.name}</h1>
            <NavLink className="button small themed" to={"/applications"}>
                {"<<"} back to applications
            </NavLink>
            <br/>
            <div id="application-page" className="scroll-content">

                {
                    loading
                    ?
                        <>Loading...</>
                    :
                        application &&
                        <ApplicationForm
                            application={application}
                            form={updates}
                            onChange={update}
                            updateApplication={fetch}
                        />
                }

                {
                    application &&
                    <div className="application-operating-systems">
                        
                        {
                            operatingSystemsRemaining &&
                            operatingSystemsRemaining.length > 0
                            &&
                            <CreateApplicationOperatingSystem
                                application={application}
                                operatingSystemsRemaining={operatingSystemsRemaining}
                                fetchApplication={()=>fetch(true)}
                            />

                        }

                        <div className="application-operating-systems-tabs">
                            {
                                application.available_operatingsystems &&
                                <div className={classNames({ "tabs simple-scrollbar": true })}>
                                    {
                                        application.available_operatingsystems.map((os, idx)=>(
                                            <div 
                                                key={os.id}
                                                className={classNames({ 
                                                    "tab": true, 
                                                    "selected": os.id === appOperatingSystem?.id
                                                })} 
                                                onClick={()=> setAppOperatingSystem(os) }
                                            >
                                                { os.name }
                                            </div>
                                            
                                        ))
                                    }
                                </div>
                            }
                        </div>
    
                        {
                            appOperatingSystem && 
                            <UpdateApplicationOperatingSystem
                                application={application}
                                app_os={appOperatingSystem}
                                fetchApplication={()=>fetch(true)}
                            />
                        }
                    </div>
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


const CreateApplicationOperatingSystem = (props: {
    application: IApplication
    operatingSystemsRemaining: IOperatingSystem[]
    fetchApplication: ()=>any
    // updateSelectedOperatingSystem: (id: string)=>any
}) =>{
    const [ operatingSystem, setOperatingSystem ] = useState<string|undefined>(props.operatingSystemsRemaining[0]?.id);
    const [ creating, setCreating ] = useState(false);

    useEffect(()=>{
        if(!operatingSystem)
            setOperatingSystem(props.operatingSystemsRemaining[0]?.id)
    }, [ props.operatingSystemsRemaining ])

    const create = useCallback(()=>{
        if(operatingSystem){
            setCreating(true)
            createApplicationOperatingSystem(props.application.id, operatingSystem)
            .then(()=>{
                toast(<>Created application operating system {operatingSystem}</>, { type: 'success' })
                props.fetchApplication();
            })
            .catch(handleRequestError)
            .finally(()=>{
                setCreating(false)
            })
        }
    }, [ operatingSystem ])


    return (
        <div className="add-operating-system">
            <Select
                value={operatingSystem}
                options={props.operatingSystemsRemaining.map((os)=>({ label: os.name, value: os.id }))}
                onChange={setOperatingSystem}
            />
            <div
                className={classNames({ 'button green inverted': true, "disabled": !operatingSystem })}
                onClick={create}
            >
                { icons.create } { creating ? "Adding OS..." : "Add OS" }
            </div>
        </div>
    )
}

const UpdateApplicationOperatingSystem = (props: {
    application: IApplication
    app_os: IApplicationOperationSystem
    fetchApplication: ()=>any
}) =>{
    const [ form, setForm ] = useState<Partial<IApplicationOperationSystemForm>>({ script: props.app_os.script });
    const [ updating, setUpdating ] = useState(false);

    useEffect(()=>{
        setForm({ script: props.app_os.script })
    }, [props.app_os])

    const onUpdate = (newUpdates: Partial<IApplicationOperationSystemForm>) =>{
        let _updates = {
            ...form,
            ...newUpdates
        }
        Object.entries(_updates).map(([k, v])=>{
            if(
                !v || v === (props.app_os as any)[k]
            ) delete (_updates as any)[k];
        })
        setForm(_updates)
    }

    const update = useCallback(()=>{
        if(form.script){
            setUpdating(true)
            updateApplicationOperatingSystem(props.application.id, props.app_os.id, form.script)
            .then(()=>{
                toast(<>updated application operating system</>, { type: 'success' })
                props.fetchApplication();
            })
            .catch(handleRequestError)
            .finally(()=>{
                setUpdating(false)
            })
        }
    }, [ form ])


    return (
        <div className="update-operating-system">
            <div
                className={classNames({ 'button blue inverted': true, "disabled": !form.script || updating })}
                onClick={update}
            >
                { icons.update } { updating ? "Updating OS..." : "Update OS"}
            </div>
            <ApplicationOperatingSystemForm
                app_os={props.app_os}
                form={form}
                onChange={onUpdate}
            />

        </div>
    )
}



const ApplicationOperatingSystemForm = (props: { 
    app_os?: IApplicationOperationSystemForm
    form: Partial<IApplicationOperationSystemForm>
    onChange: (updates: Partial<IApplicationOperationSystemForm>)=>any
}) =>{
    return (
        <div className="operating-system-form">
            <div className="form-field">
                <label>Script</label>
                {/* <CodeiumEditor
                    value={props.form.script || props.app_os?.script || ''}
                    onChange={(script)=>props.onChange({ script })}
                    language={"shell"}
                    theme='vs-dark'
                    height={200}
                /> */}
                <FormField
                    value={props.form.script || props.app_os?.script || ''}
                    onUpdate={(script)=>props.onChange({ script })}
                    textArea={{}}
                    // language={"shell"}
                    // theme='vs-dark'
                    // height={200}
                />
            </div>
        </div>
    )
}
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './ApplicationList.css';
import { NavLink } from 'react-router-dom';
import { icons } from '../../../utils/icons';
import { confirm, deleteApplication, getApplications, handleRequestError, hexToImage, IApplication } from '@desp-aas/desp-ui-fwk';



export const ApplicationList = () => {
    const [applications, setApplications] = useState<IApplication[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        fetch()
    }, [ ])


    const fetch = useCallback(() => {
        setLoading(true)
        getApplications()
        .then((response)=>{
            setApplications(response)
        })
        .catch(handleRequestError)
        .finally(()=>{
            setLoading(false)
        })
    }, [ ]);

    const handleDelete = useCallback((application: IApplication)=>{
        confirm({
            title: "Delete application",
            message: `Are you sure you want to delete ${application.name}?`,
            onConfirm: ()=>{
                deleteApplication(application.id)
                .then(()=>{
                    toast(<>Successfully removed application {application.name}</>, { type: 'success' })
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
            <h1>Applications</h1>
            <NavLink className="button green inverted" to={`/applications/create`}>
                { icons.create } Create
            </NavLink>

            <div id="applications-list">
                {
                    loading
                    ? <div className="no-data">Loading applications...</div>
                    : applications?.map((a)=>(
                        <div className='application-item'  key={a.id}>
                            <NavLink to={`/applications/${a.id}`}>
                                <ApplicationCard application={a}/>
                            </NavLink>
                            <div 
                                id="delete-application"
                                className="button red operation icon-only"
                                onClick={(ev)=> {ev.stopPropagation(); handleDelete(a)}}
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


const ApplicationCard = (props:{
    application: IApplication
}) =>{

    const [image, setImage] = useState<string>();

    useEffect(() => {
        try{
            setImage(hexToImage(props.application.icon))
        }
        catch(e){
            console.error(e)
        }
    }, []);

    return (
        <div className="application-card" >
            {/* <img className="application-card-image" src={image} style={{
                // background: `src()`
            }}/> */}
            <div className="application-card-content">
                <div className="application-card-name">
                    { props.application.name }
                </div>
                <div className="application-card-description">
                    { props.application.description }
                </div>
            </div>
        </div>
    )
}
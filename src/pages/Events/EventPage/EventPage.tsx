import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import './EventPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import { icons } from '../../../utils/icons';
import { AssetEvent } from '../AssetEvent/AssetEvent';
import { NavLink } from 'react-router-dom';
import dayjs from 'dayjs';
import { handleRequestError, IModerationEvent, getModerationEvent, acceptModerationEvent, rejectModerationEvent } from '@desp-aas/desp-ui-fwk';


export const EventPage = () => {
    const { id } = useParams() as { id: string };
    const navigate = useNavigate();

    const [event, setEvent] = useState<IModerationEvent|undefined>();
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [accepting, setAccepting] = useState(false);
    const [rejecting, setRejecting] = useState(false);

    useEffect(()=>{
        fetchEvent()
    }, [ id ])

    const fetchEvent = useCallback(() => {
        setLoadingEvents(true)
        getModerationEvent(id)
        .then((event)=>{
            setEvent(event)
        })
        .catch((e)=>{
            toast(<>The event {id} does not exist</>, { type: 'warning' })
            navigate('/moderation')
        })
        .finally(()=>{
            setLoadingEvents(false)
        })
    }, [ id ]);

    const accept = useCallback(()=>{
        if(event && !accepting && !rejecting){
            setAccepting(true)
            
            acceptModerationEvent(event.id)
            .then(()=>{
                toast(<>Successfully accepted moderation event {id}</>, { type: 'success' })
                navigate('/moderation')
            })
            .catch((e)=>{
                handleRequestError(e, { defaultMessage: <>An error has occured during accept of event {id}</> })
            })
            
            setAccepting(false)
        }

    }, [ event, accepting, rejecting, setAccepting ]);


    const reject = useCallback(()=>{
        if(event && !accepting && !rejecting){
            setRejecting(true)
            
            rejectModerationEvent(event.id)
            .then(()=>{
                toast(<>Successfully rejected moderation event {id}</>, { type: 'success' })
                navigate('/moderation')
            })
            .catch((e)=>{
                handleRequestError(e, { defaultMessage: <>An error has occured during rejection of event {id}</> })
            })
            
            setRejecting(false)
        }

    }, [ event, accepting, rejecting, setAccepting ]);


    return (
        <>
            <h1>Event</h1>
            <NavLink className="button small themed" to={"/moderation"}>
                {"<<"} back to events
            </NavLink>
            <br/>
            <div id="event-page">
                {
                    loadingEvents
                    ?
                    <div className="no-data">Loading details...</div>
                    :
                    event &&
                    <>
                        <div id="event-details">

                            <div className="row">

                                <div 
                                    className="form-field"
                                >
                                    <label>Event ID</label>
                                    <div className="form-field-value">
                                        { event.id }
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label>Event date</label>
                                    <div className="form-field-value">
                                        {  dayjs(event.date).format('DD/MM/YYYY HH:mm')  }
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="form-field">
                                    <label>Event type</label>
                                    <div className="form-field-value">
                                        { event.fonctionnal_area }
                                    </div>
                                </div>

                                <div className="form-field">
                                    <label>Event status</label>
                                    <div className="form-field-value">
                                        { event.status }
                                    </div>
                                </div>

                            </div>
                            
                        </div>
                        <div id="event-content">
                            {/* TODO: Switch depending on event type */}
                            <AssetEvent event={event}/>
                        </div>
                        <div id="event-details-operations">
                            <div
                                className={classNames({ "button inverted medium green": true, "disabled": accepting || rejecting })}
                                onClick={accept}
                            >
                                { icons.accept } { accepting ? 'Accepting...' : 'Accept'}
                            </div>
                            <div
                                className={classNames({ "button inverted medium red": true, "disabled": accepting || rejecting })}
                                onClick={reject}
                            >
                                { icons.accept } { rejecting ? 'Rejecting...' : 'Reject'}
                            </div>
                        </div>
                    </>
                }
            </div>

        </>
    );
};

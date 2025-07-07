import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import './EventsList.css';
import { NavLink } from 'react-router-dom';
import dayjs from 'dayjs';
import { getEventLink, handleRequestError, IModerationEvent, searchModerationEvents } from '@desp-aas/desp-ui-fwk';



export const EventsList = () => {
    const [events, setEvents] = useState<IModerationEvent[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    useEffect(()=>{
        fetchEvents()
    }, [ ])


    const fetchEvents = useCallback(() => {
        setLoadingEvents(true)
        searchModerationEvents()
        .then((response)=>{
            setEvents(response.events)
        })
        .catch((e)=>{
            handleRequestError(e, { defaultMessage: <>An error has occured</> })
        })
        .finally(()=>{
            setLoadingEvents(false)
        })
    }, [ ]);

    return (
        <>
            <h1>Moderation</h1>
            <div id="events-list">
                <div id="events-list-headers">
                    <div className="events-list-header">User</div>
                    <div className="events-list-header">Event type</div>
                    <div className="events-list-header">Event date</div>
                    <div className="events-list-header">Event status</div>
                </div>
                {
                    loadingEvents
                    ?
                    <div className="centered">
                        <div className="no-data">Loading...</div>
                    </div>
                    :
                    events.length > 0 ?
                    <>
                        {
                            events.map((event, index) => (
                                <NavLink
                                    className="event"
                                    key={event.id}
                                    to={getEventLink(event)}
                                >
                                    <div className="event-value">
                                        <div className="event-users">{event.user_id}</div>
                                    </div>
                                    <div className="event-value">
                                        <div className="event-type">{event.fonctionnal_area}</div>
                                    </div>
                                    <div className="event-value">
                                        <div className="event-date">{dayjs(event.date).format('DD/MM/YYYY HH:mm')}</div>
                                    </div>
                                    
                                    <div className="event-value">
                                        <div className={classNames({ "event-status": true, [ event.status?.toLocaleLowerCase() ]: true })}>{event.status}</div>
                                    </div>
                                </NavLink>
                            ))
                        }
                    </>
                    : 
                    <div className="centered">
                        <div className="no-data">No events to show</div>
                    </div>
                }
            </div>
        </>
    );
};

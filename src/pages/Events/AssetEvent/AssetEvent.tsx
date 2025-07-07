import React, { Fragment } from 'react';
import './AssetEvent.css';
import { IModerationEvent } from '@desp-aas/desp-ui-fwk';


type IProps = {
    event: IModerationEvent
}


const stringify = (value: any) =>{
    if(value === undefined) return undefined;
    switch(typeof value){
        case 'string': return value;
        case 'number': return value.toString();
        case 'object': return JSON.stringify(value);
        default: return value.toString?.();
    }
}

export const AssetEvent = (props: IProps) => {
    return (
        <>
            {
                props.event.content.data_by_type &&
                Object.entries(props.event.content.data_by_type)
                .map(([key, values])=>(
                    <Fragment key={key}>
                        {
                            values.map((value)=>(
                                <div className="row" key={value.name}> 
                                    <div className="form-field">
                                        <label>{value.name}</label>
                                        <div className="form-field-value">
                                            { value.value }
                                        </div> 
                                        {
                                            value.rejected_reasons &&
                                            value.rejected_reasons.length > 0 &&
                                            <div className="event-reasons">
                                                <ul>
                                                    {
                                                        value.rejected_reasons.map((reason, idx)=>(
                                                            <li key={idx} className='reason'>{ reason }</li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </Fragment>
                ))
            }

        </>
    );
};

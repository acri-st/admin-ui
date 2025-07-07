import { useCallback } from 'react';
import './FlavorForm.css';
import { IFlavor, IFlavorForm, Required } from '@desp-aas/desp-ui-fwk';

type IProps={
    flavor?: IFlavor
    form: Partial<IFlavorForm>
    onChange: (updates: Partial<IFlavorForm>)=>any
}
export const FlavorForm = (props: IProps)=>{

    const getValue = useCallback((column: keyof IFlavorForm) =>{
        return column in props.form ? props.form[column] : props.flavor && column in props.flavor ? props.flavor[column] :  ''
    }, [props.form, props.flavor])

    
    return (
        <div className="flavor-form">
            <div className="flavor-form-main-content">
                <div className="flavor-form-content">

                    <div className="form-field">
                        <label>Name <Required/> </label>
                        <input type="text" value={getValue("name") as any} onChange={(e)=>props.onChange({ name: e.target.value })}/>
                    </div>
                    <div className="form-field">
                        <label>processor <Required/> </label>
                        <input type="text" value={getValue("processor") as any} onChange={(e)=>props.onChange({ processor: e.target.value })}/>
                    </div>
                    <div className="form-field">
                        <label>storage <Required/> </label>
                        <input type="text" value={getValue("storage") as any} onChange={(e)=>props.onChange({ storage: e.target.value })}/>
                    </div>
                    <div className="form-field">
                        <label>gpu </label>
                        <input type="text" value={getValue("gpu") as any} onChange={(e)=>props.onChange({ gpu: e.target.value })}/>
                    </div>
                    <div className="form-field">
                        <label>bandwidth <Required/> </label>
                        <input type="text" value={getValue("bandwidth") as any} onChange={(e)=>props.onChange({ bandwidth: e.target.value })}/>
                    </div>
                    <div className="form-field">
                        <label>memory <Required/> </label>
                        <input type="text" value={getValue("memory") as any} onChange={(e)=>props.onChange({ memory: e.target.value })}/>
                    </div>
                    <div className="form-field">
                        <label>price <Required/> </label>
                        <input type="text" value={getValue("price") as any} onChange={(e)=>props.onChange({ price: e.target.value })}/>
                    </div>
                    <div className="form-field">
                        <label>openstack flavor id <Required/> </label>
                        <input type="text" value={getValue("openstack_flavor_id") as any} onChange={(e)=>props.onChange({ openstack_flavor_id: e.target.value })}/>
                    </div>

                </div>

            </div>
            
        </div>
    )
}

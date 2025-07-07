import { useCallback } from 'react';
import './OperatingSystemForm.css';
import { IOperatingSystem, IOperatingSystemForm, Required, Select } from '@desp-aas/desp-ui-fwk';

type IProps={
    operating_system?: IOperatingSystem
    form: Partial<IOperatingSystemForm>
    onChange: (updates: Partial<IOperatingSystemForm>)=>any
    updateApplication?: ()=>any
}
export const OperatingSystemForm = (props: IProps)=>{

    const getValue = useCallback((column: keyof IOperatingSystemForm) =>{
        return column in props.form ? props.form[column] : props.operating_system && column in props.operating_system ? props.operating_system[column] :  ''
    }, [props.form, props.operating_system])

    return (
        <div className="operating-system-form">
            <div className="operating-system-form-main-content">
                <div className="operating-system-form-content">

                    <div className="form-field">
                        <label>Name <Required/> </label>
                        <input type="text" value={getValue("name") as any} onChange={(e)=>props.onChange({ name: e.target.value })}/>
                    </div>
                    <div className="form-field">
                        <label>Is GUI <Required/> </label>
                        <Select
                            value={getValue("is_gui") as any}
                            onChange={(is_gui: boolean)=>props.onChange({ is_gui }) }
                            options={[
                                { label: 'True', value: true },
                                { label: 'False', value: false }
                            ]}
                        />
                    </div>
                </div>

            </div>
            
        </div>
    )
}

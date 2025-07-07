import { useCallback, useEffect, useState } from 'react';
import './ApplicationForm.css';
import { IApplication, IApplicationForm, Required } from '@desp-aas/desp-ui-fwk';

type IProps={
    application?: IApplication
    form: Partial<IApplicationForm>
    onChange: (updates: Partial<IApplicationForm>)=>any
    updateApplication?: ()=>any
}
export const ApplicationForm = (props: IProps)=>{
    
    const currentIcon = useCallback(() => props.application?.icon ? props.application.icon : undefined, [ props.application ]);
    const [ iconPreview, setIconPreview ] = useState<string|undefined>(currentIcon());

    // const updateImage = useCallback((files?: File[])=>{
    //     let file = files?.[0];
    //     // setIconPreview(undefined);
    //     props.onChange({ icon: file });
    //     if(file){
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setIconPreview(reader.result as string);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    //     else{
    //         props.onChange({ icon: undefined });
    //         setIconPreview(currentIcon())
    //     }
    // }, [ currentIcon, props.onChange ])


    const getValue = useCallback((column: keyof IApplicationForm) =>{
        return column in props.form ? props.form[column] : props.application && column in props.application ? props.application[column] :  ''
    }, [props.form, props.application])

    return (
        <div className="application-form">
            <div className="application-form-main-content">

                {/* <div className="application-form-image">
                    <div className="icon-preview">
                        <img src={iconPreview}/>
                    </div>
                </div> */}

                <div className="application-form-content">
                    {/* <div className="form-field">
                        <label>Icon <Required/> </label>
                        <FileUpload
                            files={props.form.icon ? [ props.form.icon ] : []}
                            onChange={updateImage}
                            inputProps={{
                                accept: "image/png, image/webp"
                            }}
                        />
                    </div> */}

                    <div className="form-field">
                        <label>Name <Required/> </label>
                        <input type="text" value={getValue("name") as any} onChange={(e)=>props.onChange({ name: e.target.value })}/>
                    </div>
                    <div className="form-field">
                        <label>Description <Required/> </label>
                        <textarea value={getValue("description") as any}  onChange={(e)=>props.onChange({ description: e.target.value })}/>
                    </div>
                </div>

            </div>
            
        </div>
    )
}

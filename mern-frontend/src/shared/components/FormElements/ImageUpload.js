import Button from "./Button";
import { useRef, useState, useEffect } from "react";
import './ImageUpload.css';

const ImageUpload = (props) => {

    const filePickerRef = useRef();

    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if(!file){
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file);
    }, [file])

    const pickImageHandler = () => {
        filePickerRef.current.click();
    }

    const pickedHandler = (event) => {
        let file;
        let fileIsValid = isValid;
        if(event.target.files && event.target.files.length === 1) {
            file = event.target.files[0];
            setFile(file);
            setIsValid(true);
            fileIsValid = true;
        }
        else {
            setIsValid(false);
            fileIsValid = false;
        }

        props.onInput(props.id, file, fileIsValid);
    }

    return (
        <div className={`${props.className ? props.className :'form-control'}`}>
            <input 
            id={props.id}
            style = {{display: 'none'}}
            type="file"
            accept=".jpg,.jpeg,.png"
            ref= {filePickerRef}
            onChange={pickedHandler}
            />
            <div className={`image-upload__form ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewUrl && <img className="image-preview" src={previewUrl} alt="Preview"/>}
                    {!previewUrl && <p>Please select an image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>Select Image</Button>
            </div>
        </div>
    )
}

export default ImageUpload
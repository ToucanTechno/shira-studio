import {
    Input,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftElement,
    FormErrorMessage,
    Icon,
    Image
} from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import React, {useRef, useState} from "react";

interface FileUploadProps {
    name: string;
    placeholder?: string;
    acceptedFileTypes: string;
    children: any;
    isRequired: boolean;
    handleUpload: (files: FileList) => void;
    defaultImage: string;
}

interface FileState {
    isValid: boolean;
    file: File | null;
    fileURL: string;
}
export const FileUpload = ({ name,
                             placeholder,
                             acceptedFileTypes,
                             children,
                             isRequired,
                             handleUpload,
                             defaultImage
                           }: FileUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [formState, setFormState] = useState<FileState>({
        isValid: true, file: null, fileURL: ""
    });

    const handleFileChange = (el: React.ChangeEvent<HTMLInputElement>) => {
        if (el.target.files && el.target.files.length > 0) {
            setFormState({...formState, ...{file: el.target.files[0], fileURL: URL.createObjectURL(el.target.files[0])}})
            handleUpload(el.target.files);
        }
    };

    const handleBrowseFile = (el: React.MouseEvent<HTMLInputElement>) => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    return (
        <FormControl isInvalid={!formState.isValid} isRequired={isRequired}>
            <FormLabel htmlFor="writeUpFile">{children}</FormLabel>
            <InputGroup>
                <InputLeftElement
                    pointerEvents="none">
                    <Icon as={FiFile} />
                </InputLeftElement>
                <Input type='file'
                       onChange={handleFileChange}
                       accept={acceptedFileTypes}
                       name={name}
                       ref={inputRef}
                       style={{display: 'none'}} />
                <Input
                    placeholder={placeholder || "Your file ..."}
                    onClick={handleBrowseFile}
                    // onChange={(e) => {}}
                    readOnly={true}
                    value={(formState.file && formState.file.name) || ''}
                    w='400px'
                />
            </InputGroup>
            <FormErrorMessage>
                {!formState.isValid}
            </FormErrorMessage>
            { (formState.file !== null)
                ? <Image my={1} boxSize='80px' src={formState.fileURL} />
                : (defaultImage !== '')
                    ? <Image my={1} boxSize='80px' src={defaultImage} />
                    : ''}
        </FormControl>
    );
}

FileUpload.defaultProps = {
    acceptedFileTypes: 'image/*',
    isRequired: false,
    defaultImage: '',
};

export default FileUpload;
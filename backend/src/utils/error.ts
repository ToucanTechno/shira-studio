import { Response } from "express";
import { ErrorType } from "./ErrorType";
import { StatusCodes } from "http-status-codes";
export class Error {
    status: number = StatusCodes.BAD_REQUEST;
    message: string = 'Unknown error';
    errorCode: ErrorType = ErrorType.DEFAULT_ERROR;
    constructor(message: string, status:number, errorCode:ErrorType = ErrorType.DEFAULT_ERROR){
        this.message = message;
        this.status = status;
        this.errorCode = errorCode;
    }

    send(res:Response){
        res.status(this.status).send(this);
    }

}

export class ErrorMissingFields extends Error {
    missingFields:Array<String> = [];//intended for the programer if want to automate it in some way

    constructor(fieldName: string){
        const message = `Missing the params ${fieldName}`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.MISSING_FIELDS);
        this.missingFields.push(fieldName);
    }

    addField(fieldName: string){
        this.message += `, ${fieldName}`;
        this.missingFields.push(fieldName);
    }
}

export class ErrorInvalidObjectId extends Error{
    constructor(id:string){
        const message = `the id: ${id} is not a valid objectId`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.INVALID_OBJECT_ID);
    }
}

export class ErrorInvalidType extends Error {
    constructor(paramName: string, parmType: string, expectedType:string){
        const message = `param: ${paramName} is of type ${parmType} but expected to be of type ${expectedType}`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.INVALID_TYPE);
    }
}

export class ErrorDocNotFound extends Error {
    constructor(docType:string, id:string) {
        const message = `Couldn\'t find document type: ${docType} with id: ${id}`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.DOC_NOT_FOUND);
    }
}

export class ErrorWrongFileType extends Error {
    constructor(allowedFileType:string,allowedExtensions:string[]) {
        const message = `file should be of type ${allowedFileType} and extension of file should be one of ${allowedExtensions}`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.WRONG_FILE_TYPE);
    }
}

export class ErrorDocNotUpdated extends Error {
    fieldsToUpdate;
    constructor(docId:string, fieldsToUpdate:any) {
        const message = `could't update the document with id ${docId}`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.DOC_NOT_UPDATED);
        this.fieldsToUpdate = fieldsToUpdate;
    }
}

export class ErrorDocNotDeleted extends Error {
    constructor(docId:string){
        const message = `couldn't delete document with id: ${docId}`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.DOC_NOT_DELETED);
    }
}
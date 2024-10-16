import { Response } from "express";
import { ErrorType } from "./ErrorType";
import { StatusCodes } from "http-status-codes";
export class ResponseError {
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

//how to pass the multiple parm info that correlate to each error
export class MultError extends ResponseError{
    errors: Array<ResponseError>
    constructor(errors:Array<ResponseError>){
        const message:string = 'Multiple errors'
        super(message,StatusCodes.BAD_REQUEST,ErrorType.MUL_ERROR)
        this.errors = errors
    }
}

export class ErrorMissingField extends ResponseError {
    fieldName = ''
    constructor(fieldName: string){
        const message = `Missing the params ${fieldName}`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.MISSING_FIELD);
        this.fieldName = fieldName
    }
}

export class ErrorInvalidObjectId extends ResponseError{
    fieldName = ''
    id:string
    constructor(id:string, fieldName:string){
        const message = `${fieldName}: ${id} is not a valid objectId`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.INVALID_OBJECT_ID);
        this.id = id
        this.fieldName = fieldName
    }
}

export class ErrorInvalidType extends ResponseError {
    constructor(paramName: string, parmType: string, expectedType:string){
        const message = `param: ${paramName} is of type ${parmType} but expected to be of type ${expectedType}`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.INVALID_TYPE);
    }
}

export class ErrorDocNotFound extends ResponseError {
    key
    constructor(docType:string, key:string) {
        const message = `Couldn\'t find document type: ${docType} with key: ${key}`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.DOC_NOT_FOUND);
        this.key = key
    }
}

export class ErrorWrongFileType extends ResponseError {
    constructor(allowedFileType:string,allowedExtensions:string[]) {
        const message = `file should be of type ${allowedFileType} and extension of file should be one of ${allowedExtensions}`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.WRONG_FILE_TYPE);
    }
}

export class ErrorDocNotUpdated extends ResponseError {
    fieldsToUpdate;
    constructor(docId:string, fieldsToUpdate:any) {
        const message = `could't update the document with id ${docId}`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.DOC_NOT_UPDATED);
        this.fieldsToUpdate = fieldsToUpdate;
    }
}

export class ErrorDocNotDeleted extends ResponseError {
    constructor(docId:string){
        const message = `couldn't delete document with id: ${docId}`;
        super(message,StatusCodes.BAD_REQUEST,ErrorType.DOC_NOT_DELETED);
    }
}

export class ErrorUseDedicatedUpdate extends ResponseError {
    fieldName:string
    constructor(fieldName:string){
        const message = `the field ${fieldName} should be updated in dedicated method`
        super(message,StatusCodes.METHOD_NOT_ALLOWED,ErrorType.DEDICATED_UPDATE)
        this.fieldName = fieldName
    }
}
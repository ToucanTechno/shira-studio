import { MultError, ResponseError } from "./error";


export interface ParamValidator {
    name: string;
    validationFuncs: Array< (name:string) => Promise<ResponseError | undefined> | ResponseError | undefined>;
};

export class RequestValidator {
    
    static async validate(paramArr:Array<ParamValidator>): Promise<ResponseError | undefined>{
        let errorArr:Array<ResponseError> = new Array<ResponseError>()
        for(let validation of paramArr ){
            for(let validationFunc of validation.validationFuncs){
                const result = await validationFunc(validation.name)
                if(result){
                    errorArr.push(result);
                    break;
                }
            }
        }
        if(errorArr.length > 0){
            return errorArr.length > 1 ? new MultError(errorArr) : errorArr[0]
        }
        return undefined;
    }
}
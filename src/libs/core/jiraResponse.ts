
export class JiraCLIResponse<T> {
    status: 0 | -1 = 0;
    message?: string;
    result?: T;
    error?: JiraCLIError;
}

export declare class JiraCLIError {
    statusCode?: number;
    status?: string;
    statusText?: string;
    errors?: JiraCLIErrorData[];
}

export interface JiraCLIErrorData {
    errorMessages: string[];
    errors: { [key: string]: string };
    status: number;
}

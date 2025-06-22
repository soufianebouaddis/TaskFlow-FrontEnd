

export default interface ProfileResponse {
    timeStamp?: number;
    status?: number;
    error?: string;
    success?: boolean;
    message?: string;
    data: any;
    headers?: string;
}   
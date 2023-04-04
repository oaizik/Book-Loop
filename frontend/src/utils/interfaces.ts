export interface IRequestOptions extends RequestInit {
    method: string;
    redirect?: RequestRedirect;
};

export interface IValidationError {
    value: string;
    msg: string;
    param: string;
    location: string;
};

export interface IUserValidationError {
    errors: IValidationError[];
};

export interface IUser {
    _id: string;
    userName: string;
    wishList: string[];
    msg: string;
};

export interface IUserResponse {
    token: string;
    user: IUser;
    errors: IValidationError[];
};

export interface IBook {
    id: string,
    selfLink: string;
    volumeInfo: {
        title: string;
        authors: string[];
        imageLinks: {
            smallThumbnail: string;
            thumbnail: string;
        },
        language: string;
        previewLink: string;
        infoLink: string;
    },
};

export interface IBooksResponse {
    totalItems: number;
    items: IBook[];
};


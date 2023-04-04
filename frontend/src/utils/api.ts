import config from '../config';
import { IRequestOptions } from './interfaces';

const { baseURL } = config;

export const authUser = async <IUser> (userToken: string): Promise<IUser> => {

    const myHeaders = new Headers();
    myHeaders.append("x-auth-token", userToken);

    const requestOptions: IRequestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const res = await fetch(`${baseURL}/api/users/auth/`, requestOptions);
    return res.json();
};

export const signup = async <IUserResponse> (userName: string): Promise<IUserResponse> => {

    const requestOptions: IRequestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const res = await fetch(`${baseURL}/api/users/${userName}`, requestOptions);
    return res.json();
    
};

export const getAllBooks = async <IBooksResponse> (userToken: string, pageIndex: number): Promise<IBooksResponse> => {

    const myHeaders = new Headers();
    myHeaders.append("x-auth-token", userToken);

    const requestOptions: IRequestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const res = await fetch(`${baseURL}/api/books/${pageIndex}`, requestOptions);
    return res.json();
};

export const addBookToWishList = async <IUser> (userToken: string, userId: string, bookId: string): Promise<IUser> => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-auth-token", userToken);

    const body = JSON.stringify({ userId, bookId });

    const requestOptions: IRequestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: body,
        redirect: 'follow'
    };

    const res = await fetch(`${baseURL}/api/wishList/`, requestOptions);
    return res.json();
};

export const deleteBookToWishList = async <IUser> (userToken: string, userId: string, bookId: string): Promise<IUser> => {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-auth-token", userToken);

    const body = JSON.stringify({ userId, bookId });

    const requestOptions: IRequestOptions = {
        method: 'Delete',
        headers: myHeaders,
        body: body,
        redirect: 'follow'
    };

    const res = await fetch(`${baseURL}/api/wishList/`, requestOptions);
    return res.json();
};

export const getBooksByTitle = async <IBooksResponse> (userToken: string, pageIndex: number, title: string): Promise<IBooksResponse> => {

    const myHeaders = new Headers();
    myHeaders.append("x-auth-token", userToken);

    const requestOptions: IRequestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const res = await fetch(`${baseURL}/api/books/${pageIndex}/titleSearch/${title}`, requestOptions);
    return res.json();
};

export const getBooksByIds = async <IBook> (userToken: string, bookIds: string[]): Promise<IBook[]> => {
    const myHeaders = new Headers();
    myHeaders.append("x-auth-token", userToken);
  
    const requestOptions: IRequestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
    };
  
    const promises = bookIds.map((bookId: string) => fetch(`${baseURL}/api/books/bookId/${bookId}`, requestOptions).catch(error => ({
        error: true,
        message: error.message
    })));

    const responses = await Promise.all(promises);
    const jsonPromises = responses.map(async (response) => {
        if ('error' in response) {
            return { error: true };
        } else {
            return response.json();
        }
    });

    const jsonObjects = await Promise.all(jsonPromises);
    return jsonObjects.filter(obj => !obj.error);
};
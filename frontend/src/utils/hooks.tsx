import { useState, useEffect } from 'react';

import { authUser, getAllBooks, addBookToWishList, deleteBookToWishList, getBooksByTitle, getBooksByIds } from './api';
import { IBook, IBooksResponse, IUserResponse, IUser } from './interfaces';


export const useUser = () => {

	const [user, setUser] = useState<IUser | null>(null);

	const onUserAction = (newUser: IUser | null) => {
        if (!newUser) {
            localStorage.removeItem('bookLoopToken');
        }
		setUser(newUser);
	};

	const checkAuthUser = async() => {
		const token = localStorage.getItem('bookLoopToken');
		if (token) {
			const authenticated: IUser = await authUser(token);
			if (authenticated.msg) {
				localStorage.removeItem('bookLoopToken');
			} else {
				setUser(authenticated);
			}
		}
	};

	useEffect(() => {
		checkAuthUser();
	}, []);

    return { user, onUserAction };
};

export const useDebounce = (value: any, delay: number) => {

	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {

		const timeOutId = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timeOutId);
		};
	}, [value, delay]);

	return { debouncedValue };
};

export const useLibrary = (user: IUser, searchInput: string, pageIndex: number, wishListIndicator: boolean) => {
	
    const { debouncedValue } = useDebounce(searchInput, 1000);

    const [books, setBooks] = useState<IBook[]>([]);
    const [booksCount, setBooksCount] = useState<number>(0);
    const [userWishList, setUserWishList] = useState<string[]>(user.wishList);
	const [isLoading, setIsLoading] = useState<boolean>(false);

    const onLikeClicked = async (bookId: string) => {
        const token = localStorage.getItem('bookLoopToken');
        if (wishListIndicator) {
            if (token) {
                const res: IUserResponse = await deleteBookToWishList(token, user._id, bookId);
                if (res.user) {
                    const removeIndex = books.findIndex((book: IBook) => book.id === bookId);
                    if (removeIndex > -1) {
                        books.splice(removeIndex, 1);
                        setBooks(books);
                    }
                    setUserWishList(res.user.wishList);
                } else {
                    alert(res.errors[0].msg);
                }
            }
        } else {
            if (userWishList.includes(bookId)) {
                if (token) {
                    const res: IUserResponse = await deleteBookToWishList(token, user._id, bookId);
                    if (res.user) {
                        setUserWishList(res.user.wishList);
                    } else {
                        alert(res.errors[0].msg);
                    }
                }
            } else {
                if (token) {
                    const res: IUserResponse = await addBookToWishList(token, user._id, bookId);
                    if (res.user) {
                        setUserWishList(res.user.wishList);
                    } else {
                        alert(res.errors[0].msg);
                    }
                }
            }
        }
    };

    const retriveBooks = async () => {
		setIsLoading(true);
        const token = localStorage.getItem('bookLoopToken');
        if (token) {
            const res: IBooksResponse = await getAllBooks(token, pageIndex);
            if (res.items) {
                setBooksCount(res.totalItems)
                setBooks(res.items);
            } else {
				alert('There is a server error, please try again later');
            }
        }
		setIsLoading(false);
    };

    const getSearchedBooks = async () => {
		setIsLoading(true);
        const token = localStorage.getItem('bookLoopToken');
        if (token) {
            const res: IBooksResponse = await getBooksByTitle(token, pageIndex, debouncedValue);
            if (res.items) {
                setBooksCount(res.totalItems)
                setBooks(res.items);
            } else {
                alert('There is a server error, please try again later');
            }
        }
		setIsLoading(false);
    };

    const getIndexedWishList = (list: IBook[]) => {
        if (list.length > 20) {
            const start = (pageIndex - 1) * 20;
            const end = pageIndex * 20;
            let sliced: IBook[] = [];
            if (list.length >= end) {
                sliced = list.slice(start, end);
            } else {
                sliced = list.slice(start);
            }
            return sliced;
        } else {
            return list;
        }
    };

    const getWishList = async () => {
		setIsLoading(true);
        const token = localStorage.getItem('bookLoopToken');
        if (token) {
            const res: any = await getBooksByIds(token, userWishList);
            if (debouncedValue) {
                let filtered: IBook[] = res.filter((book: IBook) => book.volumeInfo.title.includes(debouncedValue));
                filtered = getIndexedWishList(filtered);
                setBooksCount(filtered.length)
                setBooks(filtered);
            } else {
                const indexd: IBook[] = getIndexedWishList(res);
                setBooksCount(res.length)
                setBooks(indexd);
            }
        }
		setIsLoading(false);
    };

    useEffect(() => {
        if (wishListIndicator) {
            getWishList();
        } else {
            if (debouncedValue === '') {
                retriveBooks();
            } else {
                getSearchedBooks();
            }
        }
    }, [debouncedValue, pageIndex, wishListIndicator]);

	return { isLoading, debouncedValue, books, booksCount, userWishList, onLikeClicked };
};
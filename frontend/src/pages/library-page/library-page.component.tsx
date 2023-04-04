import { useState, ChangeEvent } from 'react';
import { ClickAwayListener } from '@mui/base';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CircularProgress } from '@mui/material';

import { ReactComponent as LogoSvg } from '../../assets/logo.svg';
import { ReactComponent as AvatarSvg } from '../../assets/avatar.svg';
import { ReactComponent as SearchSvg } from '../../assets/search-filled.svg';
import { ReactComponent as MyListSvg } from '../../assets/my-list.svg';

import { Book } from './components/book.component';
import { useLibrary } from '../../utils/hooks';
import { IBook, IUser } from '../../utils/interfaces';

import styles from './library-page.module.scss';


interface ILibraryPageProps {
	onUserSignout: (newUser: null) => void;
    user: IUser;
};

export const LibraryPage = ({ onUserSignout, user }: ILibraryPageProps) => {

    const [searchInput, setSearchInput] = useState<string>('');
    const [wishListIndicator, setWishListIndicator] = useState<boolean>(false);
    const [userIndicator, setUserIndicator] = useState<boolean>(false);
    const [pageIndex, setPageIndex] = useState<number>(1);

    const { isLoading, debouncedValue, books, booksCount, userWishList, onLikeClicked } = useLibrary(user, searchInput, pageIndex, wishListIndicator);

    const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => {
        setSearchInput(e.target.value);
	};

    const onDeleteInputClicked = () => {
        setSearchInput('');
    };

    const onWishListClicked = () => {
        setPageIndex(1);
        setWishListIndicator(wishListIndicator => !wishListIndicator);
    };

    const onUserClicked = () => {
        setUserIndicator(userIndicator => !userIndicator);
    };

    const onUserClickAway = () => {
        if (userIndicator) {
            setUserIndicator(false);
        }
    };

    const onSignoutClicked = () => {
        onUserSignout(null);
    };

    const onForwardClicked = () => {
        setPageIndex(pageIndex => pageIndex + 1);
    };

    const onBackwardClicked = () => {
        setPageIndex(pageIndex => pageIndex - 1);
    };


    return (
        <div className={styles.libraryPage}>
			<div className={styles.header}>
                <div className={styles.logo}>
                    <LogoSvg />
                </div>
                <div className={styles.searchContainer}>
                    <input type="text" value={searchInput} className={styles.searchInput} placeholder="looking for a book?" onChange={onInputChange} />
                    <div className={styles.searchIcon}>
                        {searchInput ? 
                            <div className={styles.xIcon} onClick={onDeleteInputClicked}>
                                <ClearIcon sx={{fontSize: '18px'}}/>
                            </div>
                            :
                            <SearchSvg />
                        }
                    </div>
                </div>
                <ClickAwayListener onClickAway={onUserClickAway}>
                    <div className={styles.navContainer}>
                        <div className={`${styles.navItem} ${wishListIndicator && styles.selected}`} onClick={onWishListClicked}>
                            <MyListSvg />
                            <div className={styles.navText}>
                                My Wish List
                            </div>
                        </div>
                        <div className={`${styles.navItem} ${userIndicator && styles.selected}`} onClick={onUserClicked}>
                            <AvatarSvg />
                            <div className={styles.navText}>
                                {user.userName}
                            </div>
                            <div className={styles.chevron}>
                                <ExpandMoreIcon sx={{fontSize: '18px'}} />
                            </div>
                            {userIndicator && <div className={styles.userDropDown}>
                                <div className={styles.dropDownItem}>
                                    {user.userName}
                                </div>
                                <div className={styles.divider} />
                                <div className={`${styles.dropDownItem} ${styles.signoutItem}`} onClick={onSignoutClicked}>
                                    <LogoutIcon sx={{fontSize: '20px'}} /> 
                                    <div className={styles.signoutText}>Sign Out</div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </ClickAwayListener>
            </div>
            <div className={styles.libraryContent}>
                {!isLoading && searchInput && debouncedValue === searchInput && <div className={styles.searchResults}>
                    {`${booksCount} results for "${searchInput}"`}
                </div>}
                <div className={styles.booksContainer}>
                    {!isLoading && books.length ? 
                        books.map((book: IBook) => { return ( <Book key={book.id} book={book} isLiked={userWishList.includes(book.id)} onLikeClicked={onLikeClicked} /> ) })
                        :
                        <div className={styles.noBook}>
                            {isLoading ? <CircularProgress color="inherit" size={70} /> : wishListIndicator ? 'Your wish list is empty...' : 'No Books to show'}
                        </div>
                    }
                </div>
                {books.length && <div className={styles.pagination}>
                    <div className={styles.arrow}>
                        {pageIndex > 1 && <span onClick={onBackwardClicked} ><ArrowBackIcon /></span>}
                    </div>
                    <div className={styles.pageIndex}>
                        {`page ${pageIndex} of ${Math.ceil(booksCount / 20)}`}
                    </div>
                    <div className={styles.arrow}>
                        {pageIndex < Math.ceil(booksCount / 20) && <span onClick={onForwardClicked} ><ArrowForwardIcon /></span>}
                    </div>
                </div>}
            </div>
        </div>
    );
};
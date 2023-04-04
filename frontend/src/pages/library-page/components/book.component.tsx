import { ReactComponent as HeartFilledSvg } from '../../../assets/heart.svg';
import { ReactComponent as OutlinedHeartSvg } from '../../../assets/outlined-heart.svg';

import styles from './book.module.scss';


interface IBookProps {
	book: any;
    isLiked: boolean;
    onLikeClicked: (bookId: string) => void;
};


export const Book= ({ book, isLiked, onLikeClicked }: IBookProps) => {
    return (
        <div className={styles.book}>
            <div className={styles.cover}>
                <div className={styles.likeContainer} onClick={() => onLikeClicked(book.id)}>
                    {isLiked ? <HeartFilledSvg /> : <OutlinedHeartSvg />}
                </div>
                <img className={styles.imgContainer} src={book.volumeInfo.imageLinks?.thumbnail} alt="preview" />
            </div>
            <div className={styles.title}>
                {book.volumeInfo.title}
            </div>
            <div className={styles.author}>
                {book.volumeInfo.authors?.map((author: string) => author).join(', ')}
            </div>
        </div>
    );
};
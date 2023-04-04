import { ChangeEvent, useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';

import { ReactComponent as LogoSvg } from '../../assets/logo.svg';
import { ReactComponent as AvatarSvg } from '../../assets/avatar.svg';

import { signup } from '../../utils/api';
import { IUserResponse, IUser } from '../../utils/interfaces';

import styles from './welcome-page.module.scss';

interface IWelcomePageProps {
	onUserSignup: (newUser: IUser) => void;
};

export const WelcomePage = ({ onUserSignup }: IWelcomePageProps) => {

	const [userName, setUserName] = useState<string>('');
	const [inputError, setInputError] = useState<string>('');

	const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => {
		setUserName(e.target.value);
	};

	const onSubmit = async () => {
		const res: IUserResponse = await signup(userName);
		if (res.errors) {
			setInputError(res.errors[0].msg);
		} else {
			localStorage.setItem("bookLoopToken", res.token);
			onUserSignup(res.user);
		}
	};


    return (
        <div className={styles.welcomePage}>
			<div className={styles.signinContainer}>
				<div className={styles.logoContainer}>
					<LogoSvg />
				</div>
				<div className={styles.titleContainer}>
					<div className={styles.title}>
						Let's Sign You In
					</div>
					<div className={styles.subTitle}>
						Welcome back, you've been missed!
					</div>
				</div>
				<div className={styles.formContainer}>
					<TextField
						id="userBane-input"
						label="User Name"
						variant="outlined"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<AvatarSvg />
								</InputAdornment>
							),
							className: styles.formInput
						}}
						onChange={(e) => onInputChange(e)}
					/>
					<div className={styles.userNameError}>
						{inputError}
					</div>
					<button className={`${styles.submitButton} ${!userName.length && styles.disabled}`} onClick={onSubmit} disabled={!userName.length}>
						SIGN IN
					</button>
				</div>
			</div>
			<div className={styles.signinImage} />
				
        </div>
    );
};
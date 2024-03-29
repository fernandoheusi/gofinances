import React, { useContext, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import {useAuth} from '../../hooks/auth';

import { SignInSocialButton } from '../../components/SignInSocialButton'

import { 
	Container, 
	Footer, 
	Header, 
	SigInTitle, 
	Title, 
	TitleWrapper, 
	FooterWrapper, 
} from './styles';

export function SignIn(){
	const [isLoading,setIsLoading] = useState(false);
	const {signInWithGoogle,signInWithApple} = useAuth();

	const theme = useTheme();

	async function handleSignInWithGoogle(){
		try {
			setIsLoading(true);
			return await signInWithGoogle();
		} catch (error) {
			console.log(error);
			Alert.alert('Não foi possível conectar a conta Google');
			setIsLoading(false);
		}
	}

	async function handleSignInWithApple(){
		try {
			setIsLoading(true);
			return await signInWithApple();
			console.log('a gente tentou');
		} catch (error) {
			console.log(error);
			Alert.alert('Não foi possível conectar a conta Apple');
			setIsLoading(false);
		}
	}

	return(
		<Container>
			<Header>
				<TitleWrapper>
					<LogoSvg 
						width ={RFValue(120)}
						height = {RFValue(68)}
					/>

					<Title>
						Controle suas{'\n'}
						finanças de forma{'\n'}
						muito simples
					</Title>
				</TitleWrapper>

				<SigInTitle>
					Faça seu login com{'\n'}
					uma conta abaixo
				</SigInTitle>
			</Header>

			<Footer>
				<FooterWrapper>
					<SignInSocialButton 
						title='Entrar com Google' 
						svg={GoogleSvg} 
						onPress={handleSignInWithGoogle}
					/>

					<SignInSocialButton 
						title='Entrar com Apple' 
						svg={AppleSvg} 
						onPress={handleSignInWithApple}
					/>
				</FooterWrapper>

				{isLoading && 
					<ActivityIndicator 
						color={theme.colors.shape} 
						size="large"
						style={{ marginTop: 18}}
					/>}
			</Footer>
		</Container>
	)
}
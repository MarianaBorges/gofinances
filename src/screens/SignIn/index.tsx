import React, { useState } from 'react';

import { Alert, ActivityIndicator, Platform } from 'react-native';
import { useTheme } from 'styled-components/native';

import LogoSVG from '../../assets/logo.svg';
import GoogleSVG from '../../assets/google.svg';
import AppleSVG from '../../assets/apple.svg';

import { SignInSocialButton } from '../../components/SignInSocialButton';

import { 
    Container, 
    Header, 
    TitleWrapper, 
    Title, 
    SignInTitle, 
    Footer,
    FooterWrapper,
} from './styles';

import { useAuth } from '../../hooks/auth';


export function SignIn(){

    const [ isLoading, setIsLoading ] = useState(false);
    const { signInWithGoogle, signInWithApple } = useAuth();
    const theme = useTheme();

    async function handleSignInWithGoogle(){
        try {
            setIsLoading(true);
            return await signInWithGoogle();
        } catch (error) {
            console.error(error);
            Alert.alert('Não foi possível logar o usuário');
            setIsLoading(false);
        }
        
    }

    async function handleSignInWithApple(){
        try {
            setIsLoading(true);
            return await signInWithApple();
        } catch (error) {
            console.error(error);
            Alert.alert('Não foi possível logar o usuário');
            setIsLoading(false);
        } 
    }


    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSVG 
                        width={120} 
                        height={68}
                    />
                    <Title>
                        Controle suas{'\n'}
                        finanças de forma{'\n'}
                        muito simples
                    </Title>
                </TitleWrapper>
                <SignInTitle>
                    Faça seu login com{'\n'}
                    uma das contas abaixo
                </SignInTitle>
                
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                        title="Entrar com Google"
                        svg={GoogleSVG}
                        onPress={handleSignInWithGoogle}
                    />

                    {
                        Platform.OS === 'ios' &&
                        <SignInSocialButton
                        title="Entrar com Apple"
                        svg={AppleSVG}
                        onPress={handleSignInWithApple}
                        />
                    }
                </FooterWrapper>

                {
                    isLoading &&
                    <ActivityIndicator 
                        color={theme.colors.shape}
                        style={{marginTop: 18}}
                    />
                }

            </Footer>
        </Container>
    )
}
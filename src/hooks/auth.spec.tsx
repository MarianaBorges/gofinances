import 'jest-fetch-mock';
import { renderHook, act } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import { AuthProvider, useAuth} from './auth';
import { startAsync } from 'expo-auth-session';
import fetchMock from 'jest-fetch-mock';
/*
*   Sobre escreve comportamentos
*   Usar em situações em que funções/metodos do 
*   código ficam muito dependentes de contextos externos
*   No caso aqui a funções depente de internet para a r
*   equisição ao Google
*/ 

jest.mock('expo-auth-session');

fetchMock.enableMocks();

describe('Auth hook', ()=> {
    it('should be able to sign in with Google account existing', async ()=> {
        const googleMocked = mocked(startAsync as any);
        googleMocked.mockReturnValueOnce({
            type: 'success',
            params:{
                access_token: 'any_token',
            }
        });
        fetchMock.mockResponseOnce(JSON.stringify({
            id: 'any_id',
            email: 'marianamarianoborges@gmail.com',
            name: 'Mariana',
            photo: 'any_photo.png'
        }));
        const { result, waitForNextUpdate } = renderHook(()=> useAuth(),{
            wrapper: AuthProvider
        });
        act(async ()=> await result.current.signInWithGoogle());
        await waitForNextUpdate();
        
        expect(result.current.user.email)
        .toBe('marianamarianoborges@gmail.com')    
    });

    it('user should not be able to sign in with Google ', async ()=> {
        const googleMocked = mocked(startAsync as any);
        googleMocked.mockReturnValueOnce({
            type: 'cancel',
        });
        const { result, waitForNextUpdate } = renderHook(()=> useAuth(),{
            wrapper: AuthProvider
        });
        act(async ()=> await result.current.signInWithGoogle());
        await waitForNextUpdate();

        expect(result.current.user).not.toHaveProperty('id')    
    });
});

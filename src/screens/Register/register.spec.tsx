import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';
import theme from '../../global/styles/theme';

import { Register } from '.';

const Providers: React.FC = ({children}) =>(
    <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
);

describe('Register Screen', () => {
    /*
    * Verifica se o modal está abrindo 
    */
    it('should be open category model when user click on button', ()=> {
        const { getByTestId } = render(
            <Register/>,
            {
                wrapper: Providers
            }
        );
        /**
         * busca o modal e o butão que abre o modal
         * e depois verifica se ao pressionar o butão o valor da 
         * propriedade do model muda pra trueh6  
         */
        const categoryModal = getByTestId("modal-category");
        const buttonCategory = getByTestId('button-category');
        fireEvent.press(buttonCategory);

        expect(categoryModal.props.visible).toBeTruthy();
    });
})

/**
 * para fazer o teste esperar a promess resolver
 * obs: transforma a função comum em uma função assíncrona
 * 
 * waitFor(()=>{
 *  expect(categoryModal.props.visible).toBeTruthy();
 * })
 **/
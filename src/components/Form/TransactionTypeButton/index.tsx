import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import {
    Container, 
    Icon,
    Title,
    Button,
} from './styles';

const icon = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle',
}

interface Props extends RectButtonProps{
    title: string;
    type:'up'|'down';
    isActive: boolean ;
}

export function TransactionTypeButton({
    isActive,
    type, 
    title, 
    ...rest
}: Props){

    return(
        <Container type ={type} isActive={isActive}>
            <Button
                {...rest }
            >
                <Icon 
                    name={icon[type]} 
                    type={type}
                />
                <Title>
                    {title}
                </Title>
            </Button>
        </Container>
    )
}
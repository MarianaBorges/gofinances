import React, {useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard ,
    Alert 
} from 'react-native';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

import {
    Container, 
    Header,
    Title,
    Form, 
    Fields,
    TransactionTypes,
} from './styles';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';


interface FormData{
    name: string;
    amount: string;
    error: string;
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigatorio'),
    amount: Yup
    .number()
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser negativo')
    .required('Preço é obrigatorio'),
});

export function Register(){
    const [category, setCategory] = useState({
        key:'category',
        name: 'Categoria'
    })
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    
    const { user } = useAuth();
    const {
        control, 
        reset,
        handleSubmit,
        formState:{errors}
    } = useForm({
        resolver: yupResolver(schema)
    });

    const navigation = useNavigation();

    function handleTransactionTypeSelect(type:'positive'|'negative'){
        setTransactionType(type);
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }
    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }

    async function handleRegister(form: FormData){
        if(!transactionType)
        return Alert.alert('Selecione tipo de transação');

        if(category.key === 'category')
        return Alert.alert('Selecione a categoria');

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date(),
        }
        try{
            const dataKey = `@gofinances:transactions_user:${user.id}`;
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
            reset();
            setTransactionType('');
            setCategory({
                key:'category',
                name: 'Categoria'
            });
            navigation.navigate('Listagem');
        }catch(error){
            console.error(error);
            Alert.alert('Não foi possível salvar a transação');
        }
    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm 
                            control={control} 
                            name="name" 
                            placeholder = "name" 
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                            />
                        <InputForm 
                            control={control} 
                            name="amount" 
                            placeholder = "Preço" 
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                            />
                        <TransactionTypes>
                            <TransactionTypeButton 
                                title='Income' 
                                type='up' 
                                isActive={transactionType === 'positive'}
                                onPress={()=>handleTransactionTypeSelect('positive')}
                                />
                            <TransactionTypeButton 
                                title='Outcome' 
                                type='down' 
                                isActive={transactionType === 'negative'}
                                onPress={()=>handleTransactionTypeSelect('negative')}

                                />
                        </TransactionTypes>
                        <CategorySelectButton testID='button-category'
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>

                    <Button 
                        title="Enviar" 
                        onPress={handleSubmit(handleRegister)}/>
                </Form>
    
                <Modal testID="modal-category" visible={categoryModalOpen}>
                    <CategorySelect 
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
 
            </Container>
        </TouchableWithoutFeedback>
    )
}
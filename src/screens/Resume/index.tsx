import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components';

import {
    Container, 
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    SelectIcon,
    Month,
    LoadContainer,
} from './styles';

import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';
import { useAuth } from '../../hooks/auth';


interface TransactionData{
    type: 'positive'|'negative'
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData{
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume(){

    const [selectedDate, setSelectedDate] = useState(new Date);
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    const [isLoading, setLoading] = useState(false);

    const theme = useTheme();    
    const { user } = useAuth();


    function handleDateChange(action: 'next' | 'prev'){
        setLoading(true);
        if(action === 'next'){
            setSelectedDate(addMonths(selectedDate,1));
        }else{
            setSelectedDate(subMonths(selectedDate,1));
        }
    }

    async function loadData(){
        setLoading(true);
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted
        .filter((expensive: TransactionData)=> 
            expensive.type === 'negative' &&
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear()  === selectedDate.getFullYear()
            );

        const expencivesTotal = expensives
        .reduce((acumullator: number, expensive: TransactionData)=>{
            return acumullator + Number(expensive.amount);
        },0)

        const totalByCategory: CategoryData[] = [];
        
        categories.forEach( category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData)=>{
                if (expensive.category === category.key){
                    categorySum += Number(expensive.amount);
                }
            });

            if (categorySum !== 0 ){
                const total = categorySum
                .toLocaleString('pt-BR',{
                    style: 'currency',
                    currency: 'BRL'
                })

                const percent = `${(categorySum / expencivesTotal * 100).toFixed(0)}%`

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total: categorySum,
                    totalFormatted: total,
                    color: category.color,
                    percent,
                });
                console.log(percent);
            }
        });
        setTotalByCategories(totalByCategory);
        setLoading(false);
    }

    useFocusEffect(useCallback(()=>{
        loadData();
    },[selectedDate]));

    return(
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            {
                isLoading ?
                <LoadContainer>
                    <ActivityIndicator 
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer> :
                <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ 
                        paddingHorizontal: 24,
                        paddingBottom: useBottomTabBarHeight(),
                    }}
                >

                    <MonthSelect>
                        <MonthSelectButton onPress={()=>handleDateChange('prev')}>
                            <SelectIcon name="chevron-left" />
                        </MonthSelectButton>

                        <Month>
                            {format(selectedDate, "MMMM,yyyy",{locale: ptBR})}
                        </Month>

                        <MonthSelectButton onPress={()=>handleDateChange('next')}>
                            <SelectIcon name="chevron-right" />
                        </MonthSelectButton>
                    </MonthSelect>

                    <ChartContainer>
                        <VictoryPie
                            data={totalByCategories}
                            colorScale={totalByCategories.map(category=>category.color)}
                            style={{
                                labels:{
                                    fontSize: RFValue(18),
                                    fontWeight: 'bold',
                                    fill: theme.colors.shape
                                }
                            }}
                            labelRadius={50}
                            x="percent"
                            y="total"
                        />
                    </ChartContainer>
                    {
                        totalByCategories.map(item => (
                            <HistoryCard 
                                key={item.key}
                                title={item.name}
                                amount={item.totalFormatted}
                                color={item.color}
                            />
                        ))
                    }
                </Content>
            }
        </Container>
    )
}
import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useTheme} from 'styled-components';

import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';

import {
	Container,
	Header,
	Title,
	Content,
	ChartContainer,
	MonthSelect,
	MonthSelectButtom,
	MonthSelectIcon,
	Month,
	LoadContainer
} from './styles';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface TransactionData{
	type: 'positive' | 'negative';
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
	const [isLoading,setIsloading] = useState(false);
	const [selectedDate,setSelectedDate] = useState(new Date());
	const [totalByCategories,setTotalByCategories] = useState<CategoryData[]>([]);

	const theme = useTheme();

	function handleChangeData(action: 'next' | 'prev'){
		if(action == 'next'){
			setSelectedDate(addMonths(selectedDate, 1));
		} else {
			setSelectedDate(subMonths(selectedDate, 1));
		}
	}
	
	async function loadData(){
		setIsloading(true);
		const dataKey = '@gofinance:transactions';
		const response = await AsyncStorage.getItem(dataKey);
		const responseFormatted = response ? JSON.parse(response) : [];

		const expensives = responseFormatted
		.filter((expensive: TransactionData)=> 
			expensive.type === 'negative' &&
			new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
			new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
		);

		const expensivesTotal = expensives.reduce((acumullator: number, expensive: TransactionData) => {
			return acumullator + Number(expensive.amount);
		}, 0);

		const totalByCategory: CategoryData[] = [];

		categories.forEach(category => {
			let categorySum = 0;

			expensives.forEach((expensive: TransactionData) => {
				if(expensive.category === category.key){
					categorySum += Number(expensive.amount);
				}
			});

			if(categorySum > 0){
				const totalFormatted =  categorySum.toLocaleString('pt-BR', {
					style: 'currency',
					currency: 'BRL'
				})

				const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`; //toFixed(0) é apenas uma casa decimal
				
					totalByCategory.push({
					key: category.key,
					name: category.name,
					color: category.color,
					total: categorySum,
					totalFormatted,
					percent,
				});
			}
		});

		setTotalByCategories(totalByCategory);
		setIsloading(false);
	}
	
	useFocusEffect(useCallback(() => {
		loadData();
	},[selectedDate]));

	return(
		<Container>
			<Header>
				<Title>Resumo por categorias</Title>
			</Header>
			{
			isLoading? 
				<LoadContainer>
					<ActivityIndicator color={theme.colors.primary} size="large"/> 
				</LoadContainer> :

				<Content
					showsVerticalScrollIndicator={false}
					contentContainerStyle= {{
						paddingHorizontal: 24,
						paddingBottom: useBottomTabBarHeight()
					}}
				>
					<MonthSelect>
						<MonthSelectButtom
							onPress={() => {handleChangeData('prev')}}
						>
							<MonthSelectIcon name="chevron-left"/>
						</MonthSelectButtom>

						<Month>{format(selectedDate, 'MMMM, yyyy',{locale: ptBR})}</Month>

						<MonthSelectButtom
							onPress={() => {handleChangeData('next')}}
						>
							<MonthSelectIcon name="chevron-right"/>
						</MonthSelectButtom>
					</MonthSelect>

					<ChartContainer>
						<VictoryPie 
							data={totalByCategories}
							colorScale={totalByCategories.map(category => category.color)}
							style={{
								labels: {
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
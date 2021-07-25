import React, {useState} from 'react';
import { Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';
import { useForm } from 'react-hook-form';

import { Button } from '../../components/Form/Button';
import { Input } from '../../components/Form/Input';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm'

import { CategorySelect } from '../CategorySelect';

import { Container, Header, Title, Form, Fields, TransactionTypes } from './styles';

interface FormData {
	name: string;
	amount: string;
}

export function Register() {
	const {
		control,
		handleSubmit
	} = useForm()

	const [transactionType,setTransactionType] = useState('');

	const [category, setCategory] = useState({
		key: 'category',
		name: 'Categoria'
	});

	const [categoryModalOpen, setCategoryModalOpen] = useState(false);

	function handleTransactionTypeSelect(type: 'up' | 'down'){
		setTransactionType(type);
	}

	function handleOpenSelectCategoryModal(){
		setCategoryModalOpen(true);
	}

	function handleCloseSelectCategoryModal(){
		setCategoryModalOpen(false);
	}

	function handleRegister(form: FormData){
		const data = {
			name: form.name,
			amount: form.amount,
			transactionType,
			category: category.key
		}
		
		console.log(data);
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
							name='name'
							control={control}
							placeholder='Nome'
							autoCapitalize='sentences'
							autoCorrect={false}
						/>

						<InputForm
							name='amount'
							control={control}
							placeholder="Preço"
							keyboardType="numeric"
						/>

						<TransactionTypes>
							<TransactionTypeButton 
								isActive={transactionType === 'up'? true : false} 
								onPress={() => handleTransactionTypeSelect('up')} 
								type="up"
								title="InCome"
							/>

							<TransactionTypeButton 
								isActive={transactionType === 'down'? true : false} 
								onPress={() => handleTransactionTypeSelect('down')} 
								type="down"
								title="OutCome"
							/>
						</TransactionTypes>

						<CategorySelectButton 
							title={category.name}
							onPress={handleOpenSelectCategoryModal}
						/>
					</Fields>

					<Button
						title="Enviar"
						onPress={handleSubmit(handleRegister)}
					/>
				</Form>

				<Modal visible={categoryModalOpen}>
					<CategorySelect 
						category= {category}
						setCategory= {setCategory}
						closeSelectCategory= {handleCloseSelectCategoryModal}
					/>
				</Modal>

			</Container>
		</TouchableWithoutFeedback>
	)
} 
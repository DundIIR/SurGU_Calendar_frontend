import { Flex, Spinner, Text } from '@chakra-ui/react'

const LoadPage = ({ content }) => {
	return (
		<>
			<Flex direction="column" alignItems="center" justifyContent="center" height="100%" gap={4} overflow="hidden">
				<Spinner thickness="4px" speed="0.65s" size={{ base: 'lg', md: 'lg', lg: 'xl' }} />
				<Text fontSize={'lg'} color="gray.600" textAlign={'center'}>
					{content ? content : 'Пожалуйста, подождите... Идёт проверка данных'}
				</Text>
			</Flex>
		</>
	)
}

export default LoadPage

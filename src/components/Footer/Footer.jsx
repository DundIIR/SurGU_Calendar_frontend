import { useState } from 'react'
import {
	Box,
	Text,
	Link,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	VStack,
	HStack,
	Icon,
} from '@chakra-ui/react'
import { FaTelegram, FaEnvelope, FaQuestionCircle } from 'react-icons/fa'

const Footer = () => {
	const { isOpen, onOpen, onClose } = useDisclosure()

	return (
		<Box as="footer" pb={6} pt={12} mt="auto">
			<Box maxW="1200px" mx="auto" px={4}>
				<HStack justifyContent="space-between" alignItems="center">
					<VStack alignItems="flex-start" spacing={1}>
						<Text fontSize="sm">© {new Date().getFullYear()} СурГУ Календарь</Text>
						<Link href="/privacy-policy" fontSize="sm" color="blackAlpha.500">
							Политика конфиденциальности
						</Link>
					</VStack>

					<Button onClick={onOpen} leftIcon={<Icon />} colorScheme="blackAlpha" size="sm" variant="outline">
						Поддержка
					</Button>
				</HStack>
			</Box>

			{/* Модальное окно поддержки */}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Свяжитесь с нами</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<VStack spacing={4} alignItems="flex-start">
							<Text>Если у вас есть вопросы или предложения, напишите нам:</Text>

							<Box>
								<HStack spacing={2}>
									<Icon as={FaTelegram} color="blue.500" />
									<Link href="https://t.me/Danya_Ber" isExternal color="blackAlpha.700" fontWeight="medium">
										@Danya_Ber
									</Link>
								</HStack>
								<Text fontSize="sm" ml={6} mt={1}>
									Telegram - предпочтительный способ связи
								</Text>
							</Box>

							<Box>
								<HStack spacing={2}>
									<Icon as={FaEnvelope} color="blue.500" />
									<Link href="surgu.calendar@gmail.com" color="blackAlpha.700" fontWeight="medium">
										surgu.calendar@gmail.com
									</Link>
								</HStack>
								<Text fontSize="sm" ml={6} mt={1}>
									Электронная почта
								</Text>
							</Box>

							<Text fontSize="sm" mt={4}>
								Мы постараемся ответить вам в течение 24 часов.
							</Text>
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	)
}

export default Footer

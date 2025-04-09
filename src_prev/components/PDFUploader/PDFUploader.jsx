import React, { useState } from 'react'
import { Box, Button, Flex, Input, Text, VStack, IconButton, useToast } from '@chakra-ui/react'
import { FiTrash2, FiUpload } from 'react-icons/fi'
import axios from 'axios'
import { useSession } from '@supabase/auth-helpers-react'

const PDFUploader = () => {
	const session = useSession()
	const [files, setFiles] = useState([])
	const toast = useToast()

	const handleFileChange = event => {
		const selectedFiles = Array.from(event.target.files)
		const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf')

		if (pdfFiles.length !== selectedFiles.length) {
			toast({
				title: 'Ошибка',
				description: 'Только PDF файлы разрешены.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			})
		}

		setFiles(prevFiles => [...prevFiles, ...pdfFiles])
	}

	const handleRemoveFile = index => {
		setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
	}

	const handleUpload = async () => {
		if (files.length === 0) {
			toast({
				title: 'Нет файлов',
				description: 'Пожалуйста, добавьте файлы для загрузки.',
				status: 'info',
				duration: 3000,
				isClosable: true,
			})
			return
		}

		const formData = new FormData()
		files.forEach(file => formData.append('files', file))

		try {
			toast({
				title: 'Загрузка...',
				description: 'Отправляем файлы на сервер.',
				status: 'info',
				duration: 1500,
				isClosable: true,
			})

			const response = await axios.post('/api/upload-files/', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${session.access_token}`,
				},
			})

			const data = response.data
			if (response.status == 200) {
				toast({
					title: 'Успех!',
					description: `Файлы успешно отправлены на сервер)`,
					status: 'success',
					duration: 3000,
					isClosable: true,
				})
			} else {
				throw new Error(data)
			}

			setFiles([])
		} catch (error) {
			console.error(error)
			console.log(error.response.data.error)
			toast({
				title: error.status === 500 ? 'Ошибка хранилища' : 'Ошибка в файле',
				description: `${error.response.data.error}`,
				status: 'error',
				duration: 3000,
				isClosable: true,
			})
		}
	}

	return (
		<Box p={6} borderWidth={1} borderRadius="md" boxShadow="md" h="100%" width="900px">
			<VStack spacing={4} align="stretch">
				<Input type="file" accept=".pdf" multiple onChange={handleFileChange} display="none" id="file-input" />
				<label htmlFor="file-input">
					<Button as="span" leftIcon={<FiUpload />} colorScheme="blue">
						Загрузить файлы
					</Button>
				</label>

				{files.length > 0 && (
					<Box maxH="400px">
						<Text fontWeight="bold" mb={2}>
							Загруженные файлы:
						</Text>
						<VStack maxH="300px" spacing={2} align="stretch" overflowY="auto">
							{files.map((file, index) => (
								<Flex
									key={index}
									justifyContent="space-between"
									alignItems="center"
									p={2}
									borderWidth={1}
									borderRadius="md"
									boxShadow="sm">
									<Text isTruncated>{file.name}</Text>
									<IconButton
										aria-label="Удалить файл"
										icon={<FiTrash2 />}
										colorScheme="red"
										size="sm"
										onClick={() => handleRemoveFile(index)}
									/>
								</Flex>
							))}
						</VStack>
					</Box>
				)}

				<Button colorScheme="green" onClick={handleUpload} isDisabled={files.length === 0}>
					Отправить на сервер
				</Button>
			</VStack>
		</Box>
	)
}

export default PDFUploader

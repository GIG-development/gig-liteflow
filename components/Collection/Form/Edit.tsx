import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    SimpleGrid,
    Stack,
    Text,
  } from '@chakra-ui/react'
import Tooltip from 'components/Tooltip/Tooltip'
import Dropzone from 'components/Dropzone/Dropzone'
import { FC } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { useForm } from 'react-hook-form'
import useUpdateCollection from 'hooks/useUpdateCollection'

export type FormData = {
    image: File | string
    cover: File | string
    name: string
    description: string
    twitter: string
    discord: string
    website: string
}

type Props = {
    account: string | null | undefined
    onSuccess: (address: string) => Promise<void>
    collectionDetails: {
        address: string
        chainId: number
        name: string
        description: string | null
        image: string | null
        cover: string | null
        twitter: string | null
        discord: string | null
        website: string | null
        deployerAddress: string
    }
    uploadUrl: string
  }

const CollectionEditForm: FC<Props> = ({
    account,
    onSuccess,
    collectionDetails,
    uploadUrl
  }) => {
    const { t } = useTranslation('components')
    const { cover, image, name, description, twitter, discord, website} = collectionDetails
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        defaultValues: {
            name: name,
            description: description || '',
            image: image || undefined,
            cover: cover || undefined,
            twitter: twitter || '',
            discord: discord || '',
            website: website || '',
        },
    })

    const updateCollection = useUpdateCollection(uploadUrl, collectionDetails.address || '')

    const onSubmit = handleSubmit(async (data) => {
        try{
            const updatedCollection = await updateCollection({
                name: data.name,
                description: data.description,
                image: data.image,
                cover: data.cover,
                twitter: data.twitter,
                discord: data.discord,
                website: data.website
            })
            if(updatedCollection) void onSuccess(collectionDetails.address || '')
        }catch(e){
            console.error(e)
        }
    })
    
    if(account?.toUpperCase() !== collectionDetails.deployerAddress.toUpperCase()) return null

    return(
        <SimpleGrid
            as="form"
            mt={12}
            rowGap={{ base: 8, md: 0 }}
            gap={{ base: 0, md: 8, lg: 12 }}
            templateColumns={{ md: '264px 1fr' }}
            onSubmit={onSubmit}
        >
            <Dropzone
                label={t('collection.form.create.image.label')}
                heading={t('user.form.edit.image.heading')}
                hint={t('user.form.edit.image.hint')}
                acceptTypes="image/jpeg,image/png,image/gif,image/webp"
                maxSize={10000000} // 10 MB
                name="image"
                control={control}
                rounded
                withPlaceholder
                value={image || undefined}
            >
                {({ hasPreview }) =>
                hasPreview
                    ? t('user.form.edit.image.file.replace')
                    : t('user.form.edit.image.file.chose')
                }
            </Dropzone>
            <Stack spacing={8}>
                <Dropzone
                label={t('user.form.edit.cover.label')}
                    heading={t('user.form.edit.cover.heading')}
                    hint={t('user.form.edit.cover.hint')}
                    acceptTypes="image/jpeg,image/png,image/gif,image/webp"
                    maxSize={10000000} // 10 MB
                    name="cover"
                    control={control}
                    withPlaceholder
                    value={cover || undefined}
                    >
                    {({ hasPreview }) =>
                        hasPreview
                        ? t('user.form.edit.cover.file.replace')
                        : t('user.form.edit.cover.file.chose')
                    }
                </Dropzone>
                <FormControl isInvalid={!!errors.name}>
                    <HStack spacing={1} mb={2}>
                        <FormLabel htmlFor="name">
                            <Flex align='center'>
                                {t('collection.form.create.name.label')}
                                <Tooltip text={t('collection.form.create.name.tooltip')}/>
                            </Flex>
                        </FormLabel>
                        <FormHelperText fontSize='xs'>
                            {t('token.form.create.terms.required')}
                        </FormHelperText>
                    </HStack>
                    <Input
                        id="name"
                        placeholder={t('collection.form.create.name.placeholder')}
                        {...register('name', {
                            required: t('collection.form.create.validation.required'),
                        })}
                    />
                    {errors.name && (
                        <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                    )}
                </FormControl>
                
                <FormControl isInvalid={!!errors.description}>
                    <HStack spacing={1} mb={2}>
                        <FormLabel htmlFor="description">
                            <Flex align='center'>
                                {t('collection.form.create.description.label')}
                                <Tooltip text={t('collection.form.create.description.tooltip')}/>
                            </Flex>
                        </FormLabel>
                        <FormHelperText fontSize='xs'>
                            {t('token.form.create.terms.required')}
                        </FormHelperText>
                    </HStack>
                    <Input
                        id="description"
                        placeholder={t('collection.form.create.description.placeholder')}
                        {...register('description', {
                            required: t('collection.form.create.validation.required'),
                        })}
                    />
                    {errors.description && (
                        <FormErrorMessage>{errors.description.message}</FormErrorMessage>
                    )}
                </FormControl>       

                <FormControl isInvalid={!!errors.twitter}>
                    <HStack spacing={1} mb={2}>
                        <FormLabel htmlFor="twitter">
                            <Flex align='center'>
                                {t('collection.form.create.twitter.label')}
                                <Tooltip text={t('collection.form.create.twitter.tooltip')}/>
                            </Flex>
                        </FormLabel>
                    </HStack>
                    <Input
                        id="twitter"
                        placeholder={t('collection.form.create.twitter.placeholder')}
                        {...register('twitter')}
                    />
                    {errors.twitter && (
                        <FormErrorMessage>{errors.twitter.message}</FormErrorMessage>
                    )}
                </FormControl>

                <FormControl isInvalid={!!errors.discord}>
                    <HStack spacing={1} mb={2}>
                        <FormLabel htmlFor="discord">
                            <Flex align='center'>
                                {t('collection.form.create.discord.label')}
                                <Tooltip text={t('collection.form.create.discord.tooltip')}/>
                            </Flex>
                        </FormLabel>
                    </HStack>
                    <Input
                        id="discord"
                        placeholder={t('collection.form.create.discord.placeholder')}
                        {...register('discord')}
                    />
                    {errors.discord && (
                        <FormErrorMessage>{errors.discord.message}</FormErrorMessage>
                    )}
                </FormControl>       

                <FormControl isInvalid={!!errors.website}>
                    <HStack spacing={1} mb={2}>
                        <FormLabel htmlFor="website">
                            <Flex align='center'>
                                {t('collection.form.create.website.label')}
                                <Tooltip text={t('collection.form.create.website.tooltip')}/>
                            </Flex>
                        </FormLabel>
                    </HStack>
                    <Input
                        id="website"
                        placeholder={t('collection.form.create.website.placeholder')}
                        {...register('website')}
                    />
                    {errors.website && (
                        <FormErrorMessage>{errors.website.message}</FormErrorMessage>
                    )}
                </FormControl>


                <Button type="submit" isLoading={isSubmitting}>
                    <Text as="span" isTruncated>
                        {t('collection.form.create.edit-button')}
                    </Text>
                </Button>
            </Stack>
        </SimpleGrid>
    )
}

export default CollectionEditForm
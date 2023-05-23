import {
    Box,
    Heading,
    Text,
    useToast
  } from '@chakra-ui/react'
  import { useWeb3React } from '@web3-react/core'
  import useTranslation from 'next-translate/useTranslation'
  import { useRouter } from 'next/router'
  import { wrapServerSideProps } from 'props'
  import { FC, useMemo, useCallback } from 'react'
  import invariant from 'ts-invariant'
  import Head from 'components/Head'
  import {
    convertCollectionFull,
  } from 'convert'
  import environment from 'environment'
  import {
    FetchCollectionDetailsDocument,
    FetchCollectionDetailsQuery,
    FetchCollectionDetailsQueryVariables,
    useFetchCollectionDetailsQuery,
  } from '../../../../graphql'
  import CollectionEditForm from 'components/Collection/Form/Edit'
  import SmallLayout from 'layouts/small'
  
  type Props = {
    chainId: number
    collectionAddress: string
    currentAccount: string | null
    now: string
  }
  
  export const getServerSideProps = wrapServerSideProps<Props>(
    environment.GRAPHQL_URL,
    async (ctx, client) => {
      const now = new Date()
      const chainIdStr = ctx.params?.chainId
        ? Array.isArray(ctx.params.chainId)
          ? ctx.params.chainId[0]
          : ctx.params.chainId
        : null
      invariant(chainIdStr, 'chainId is required')
      const chainId = parseInt(chainIdStr, 10)
      const collectionAddress = ctx.params?.id
        ? Array.isArray(ctx.params.id)
          ? ctx.params.id[0]
          : ctx.params.id
        : null
      invariant(collectionAddress, 'Collection Address is required')
  
      const { data, error } =
        await client.query<
          FetchCollectionDetailsQuery,
          FetchCollectionDetailsQueryVariables
        >({
          query: FetchCollectionDetailsDocument,
          variables: {
            collectionAddress: collectionAddress,
            chainId: chainId,
          },
        })
  
      if (error) throw error
      if (!data)
        throw new Error('collectionDetailsData is falsy')
      if (!data.collection) return { notFound: true }
  
      return {
        props: {
          chainId,
          collectionAddress: collectionAddress,
          currentAccount: ctx.user.address,
          now: now.toJSON(),
        },
      }
    },
  )
  
  const CollectionPage: FC<Props> = ({
    chainId,
    collectionAddress,
  }) => {
    const { push } = useRouter()
    const { t } = useTranslation('templates')
    const { account } = useWeb3React()
    const { data: collectionData } = useFetchCollectionDetailsQuery({
      variables: {
        collectionAddress: collectionAddress,
        chainId: chainId,
      },
    })
  
    const collectionDetails = useMemo(
      () =>
        collectionData?.collection
          ? convertCollectionFull(collectionData.collection)
          : null,
      [collectionData],
    )

    const toast = useToast()
    const onSuccess = useCallback(
        async (collectionAddress: string) => {
          toast({
            title: t('users.form.notifications.updated'),
            status: 'success',
          })
          await push(`/collection/${collectionDetails?.chainId}/${collectionAddress}`)
        },
        [toast, t, push, collectionDetails],
    )
  
    if (!collectionDetails) return null
    if (account && collectionDetails.deployerAddress.toUpperCase() !== account.toUpperCase()){
        return (
            <SmallLayout>
            <Head title="Explore collection" />
            <Box>
                <Heading>{t('asset.form.collection.edit.title')}</Heading>
                <Text>{t('asset.form.collection.edit.onlyOwner')}</Text>
            </Box>
            </SmallLayout>
        )
    }
    return (
      <SmallLayout>
        <Head title="Explore collection" />
        <Box>
            <Heading>{t('asset.form.collection.edit.title')}</Heading>
            <CollectionEditForm
                account={account}
                onSuccess={onSuccess}
                collectionDetails={collectionDetails}
                uploadUrl={environment.UPLOAD_URL}
            />
        </Box>
      </SmallLayout>
    )
  }
  
  export default CollectionPage
  
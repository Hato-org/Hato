import { Box, Center, HStack, Skeleton, Text, VStack } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { Virtuoso } from 'react-virtuoso';
import BookInfo from './BookInfo';
import { libraryBookmarkAtom } from '@/store/library';
import { useBookInfo } from '@/hooks/library';
import Error from '../cards/Error';

export default function Bookmarks() {
  const bookmarks = useRecoilValue(libraryBookmarkAtom);

  return (
    <Center w="100%" pt={2} px={4} mb={24}>
      {bookmarks.length ? (
        <Virtuoso
          useWindowScroll
          data={bookmarks}
          itemContent={(index, isbn) => (
            <Box py={2}>
              <BookInfoAsync isbn={isbn} />
            </Box>
          )}
          style={{ width: '100%' }}
        />
      ) : (
        <Text textStyle="description" fontWeight="bold">
          ブックマークした本がありません
        </Text>
      )}
    </Center>
  );
}

function BookInfoAsync({ isbn }: { isbn: string }) {
  const { data, isLoading, error, isError } = useBookInfo(isbn);

  if (isError) return <Error error={error} />;

  return isLoading ? (
    <HStack p={2} pr={4} w="100%" spacing={4}>
      <Skeleton boxSize={16} rounded="lg" />
      <VStack align="flex-start" spacing={2}>
        <Skeleton h={4} w={48} rounded="md" maxW="100%" />
        <Skeleton h={4} w={24} rounded="md" />
      </VStack>
    </HStack>
  ) : (
    <BookInfo {...data} />
  );
}

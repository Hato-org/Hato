import { Box, Heading, HStack } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/nav/Header';
import Bookmarks from '@/components/library/Bookmarks';
import BackButton from '@/components/layout/BackButton';

export default function LibraryBookmarks() {
  return (
    <Box>
      <Helmet>
        <title>ブックマーク - {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>
      <Header>
        <HStack w="100%">
          <BackButton />
          <Heading size="md" ml={2} py={4}>
            ブックマーク
          </Heading>
        </HStack>
      </Header>
      <Bookmarks />
    </Box>
  );
}

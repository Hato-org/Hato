import {
  VStack,
  Center,
  Icon,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import { TbArrowNarrowDown } from 'react-icons/tb';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useClient } from '../../modules/client';
import CardElement from '../cards';
import Loading from '../common/Loading';
import ChakraPullToRefresh from '../layout/PullToRefresh';
import Card from './Card';

function Hatoboard() {
  const { client } = useClient();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<Post[], AxiosError>(
    ['posts', 'hatoboard'],
    async () => (await client.get('/post')).data,
    {
      cacheTime: Infinity,
    }
  );

  if (isLoading) return <Loading />;
  if (error) return <CardElement.Error error={error} />;

  return (
    <ChakraPullToRefresh
      w="100%"
      pt={4}
      pb={8}
      onRefresh={async () => {
        await Promise.all([
          queryClient.invalidateQueries(['posts', 'hatoboard']),
        ]);
      }}
      refreshingContent={<Loading />}
      pullingContent={
        <Center flexGrow={1} p={4}>
          <Icon as={TbArrowNarrowDown} w={6} h={6} color="gray.500" />
        </Center>
      }
    >
      <Tabs w="100%" isFitted size="lg">
        <TabList w="100%">
          <Tab
            textStyle="title"
            _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
          >
            すべて
          </Tab>
          <Tab
            textStyle="title"
            _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
          >
            校外
          </Tab>
          <Tab
            textStyle="title"
            _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
          >
            校内
          </Tab>
        </TabList>
        <TabPanels w="100%" p={0}>
          <TabPanel w="100%" p={0}>
            <VStack p={4} spacing={4} w="100%">
              {data?.map((post) => (
                <Card {...post} key={post._id} />
              ))}
            </VStack>
          </TabPanel>
          <TabPanel w="100%" p={0}>
            <VStack p={4} spacing={4} w="100%">
              {data
                ?.filter((post) =>
                  post.tags.some((tag) => tag.value === 'public')
                )
                .map((post) => (
                  <Card {...post} key={post._id} />
                ))}
            </VStack>
          </TabPanel>
          <TabPanel w="100%" p={0}>
            <VStack p={4} spacing={4} w="100%">
              {data
                ?.filter((post) =>
                  post.tags.some((tag) => tag.value === 'private')
                )
                .map((post) => (
                  <Card {...post} key={post._id} />
                ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraPullToRefresh>
  );
}

export default Hatoboard;
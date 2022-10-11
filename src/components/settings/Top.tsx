import { useMemo } from 'react';
import {
  HStack,
  VStack,
  Avatar,
  Heading,
  Text,
  Link,
  Icon,
  Spacer,
  Button,
  StackProps,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  UnorderedList,
  ListItem,
  ModalFooter,
  StackDivider,
  Box,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TbBrandGithub, TbChevronRight } from 'react-icons/tb';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns/esm';
import { useAuth } from '@/modules/auth';
import { useUser } from '@/hooks/user';
import { MotionVStack } from '../motion';
import SettingButton, { SettingButtonProps } from './Button';

function Top() {
  const { logout } = useAuth();
  const { data: user } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const { data: totalCache, refetch } = useQuery(
    ['storage'],
    async () => {
      const { usage } = await navigator.storage.estimate();
      return usage ? (usage / 1024 / 1024).toFixed(2) : 0;
    },
    {
      staleTime: 0,
      cacheTime: 0,
      retry: false,
    }
  );

  const settingsMenu = useMemo(
    () => ({
      display: [
        {
          label: 'テーマ',
          description: (
            <span>
              背景色を変更できま<s>す。</s>せん。ごめん。
            </span>
          ),
          href: 'theme',
        },
      ],
    }),
    []
  );

  return (
    <MotionVStack
      w="100%"
      spacing={8}
      initial={{ x: '-100vw', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100vw', opacity: 0 }}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.4,
      }}
      layout
    >
      <SettingCategory w="100%" title="アカウント">
        <HStack
          p={2}
          w="100%"
          spacing={4}
          rounded="xl"
          as={RouterLink}
          to="account"
          layerStyle="button"
        >
          <Avatar src={user?.avatar} size="sm" />
          <VStack align="flex-start" spacing={0} flexShrink={1}>
            <Text textStyle="title" fontSize="md">
              {user?.name}
            </Text>
            <Text textStyle="description" fontSize="xs" noOfLines={1}>
              {user?.email}
            </Text>
          </VStack>
          <Spacer />
          <Text textStyle="description" fontWeight="bold" whiteSpace="nowrap">
            {user?.contributionCount} pt
          </Text>
          <Icon as={TbChevronRight} />
        </HStack>
      </SettingCategory>
      <SettingCategory w="100%" title="画面表示">
        {settingsMenu.display.map((elem: SettingButtonProps) => (
          <SettingButton {...elem} key={elem.label} />
        ))}
      </SettingCategory>
      <SettingCategory w="100%" title="その他">
        <SettingButton label="キャッシュ削除" onClick={onOpen}>
          <>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent rounded="xl">
                <ModalHeader>キャッシュを削除しますか？</ModalHeader>
                <ModalBody>
                  <VStack align="flex-start" w="100%" textStyle="title">
                    <Text fontSize="lg">以下のキャッシュが削除されます</Text>
                    <UnorderedList pl={4}>
                      <ListItem>はとボード投稿</ListItem>
                      <ListItem>時間割</ListItem>
                      <ListItem>イベント</ListItem>
                    </UnorderedList>
                    {totalCache && (
                      <Box w="100%">
                        <StackDivider />
                        <Text fontSize="lg">合計 {totalCache} MB</Text>
                      </Box>
                    )}
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack>
                    <Button variant="ghost" rounded="lg" onClick={onClose}>
                      キャンセル
                    </Button>
                    <Button
                      colorScheme="red"
                      rounded="lg"
                      onClick={() => {
                        queryClient.removeQueries(['timetable']);
                        queryClient.removeQueries(['calendar']);
                        queryClient.removeQueries(['posts']);
                        queryClient.removeQueries(['post']);
                        refetch();
                        onClose();
                      }}
                    >
                      削除
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>
            {totalCache && <Text>{totalCache} MB</Text>}
            <Icon as={TbChevronRight} />
          </>
        </SettingButton>
      </SettingCategory>
      <Button
        w="100%"
        variant="ghost"
        color="red.500"
        onClick={logout}
        rounded="lg"
      >
        ログアウト
      </Button>
      <HStack w="100%" justify="center">
        <Link
          href={import.meta.env.VITE_REPO_URL}
          isExternal
          _hover={{ textDecoration: 'none' }}
        >
          <Button
            variant="solid"
            bg="#0d1117"
            color="white"
            _hover={{
              bg: 'gray.600',
            }}
            rounded="lg"
            leftIcon={<TbBrandGithub />}
          >
            GitHub
          </Button>
        </Link>
      </HStack>
      <VStack>
        <Text textStyle="description" color="gray.400">
          Hato (Beta) build {__GIT_COMMIT_HASH__}/{' '}
          {format(new Date(__GIT_COMMIT_TIMESTAMP__), 'yyyy-MM-dd HH:mm')}
        </Text>
      </VStack>
    </MotionVStack>
  );
}

interface CategoryProps extends StackProps {
  title: string;
}

function SettingCategory({ title, children, ...rest }: CategoryProps) {
  return (
    <VStack align="flex-start" spacing={4} {...rest}>
      <Heading as="h2" size="lg" textStyle="title">
        {title}
      </Heading>
      {children}
    </VStack>
  );
}

export default Top;

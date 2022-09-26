import {
  Box,
  Center,
  CenterProps,
  Collapse,
  HStack,
  Icon,
  Progress,
  Text,
} from '@chakra-ui/react';
import { onlineManager, useIsFetching } from '@tanstack/react-query';
import { TbCloudOff } from 'react-icons/tb';

function Header({ children, ...rest }: CenterProps) {
  const isFetching = useIsFetching();
  const isOnline = onlineManager.isOnline();

  return (
    <Center
      position="sticky"
      flexDirection="column"
      w="100%"
      top={0}
      // py={4}
      mb={4}
      borderBottom="1px solid"
      borderColor="gray.100"
      bg="white"
      shadow="xl"
      zIndex={1}
      {...rest}
    >
      <Box w="100%">
        <Collapse in={!isOnline}>
          <HStack w="100%" justify="center" py={1} bg="gray.300">
            <Icon as={TbCloudOff} w={6} h={6} />
            <Text textStyle="title">オフライン</Text>
          </HStack>
        </Collapse>
      </Box>
      {children}
      <Box w="100%">
        <Collapse in={!!isFetching}>
          <Progress w="100%" size="xs" isIndeterminate />
        </Collapse>
      </Box>
    </Center>
  );
}

export default Header;

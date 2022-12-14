import React, { useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Portal,
  Spacer,
  StackDivider,
  StackProps,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import {
  TbHome,
  TbClipboardList,
  TbCalendar,
  TbFileDescription,
  TbSettings,
  TbBook2,
  TbLogout,
} from 'react-icons/tb';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { overlayAtom } from '@/store/overlay';
import { useAuth } from '@/modules/auth';
import Account from '../login/Account';

export default function SideMenu() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return isMobile ? (
    <SideMenuDrawer />
  ) : (
    <Box px={2}>
      <MenuBody />
    </Box>
  );
}

export function SideMenuDrawer() {
  const location = useLocation();
  const [overlay, setOverlay] = useRecoilState(overlayAtom);
  const onClose = useCallback(
    () => setOverlay((currVal) => ({ ...currVal, menu: false })),
    [setOverlay]
  );

  useEffect(() => {
    onClose();
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Portal>
      <Drawer isOpen={overlay.menu} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent bg="panel">
          <DrawerCloseButton top={9} right={8} />
          <DrawerBody p={4}>
            <MenuBody />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Portal>
  );
}

function MenuBody() {
  const { logout } = useAuth();
  const location = useLocation();
  const breakPoint = useBreakpointValue({ base: 0, md: 1, lg: 2 }) ?? 0;

  const menu = useMemo<
    (
      | ({
          type: 'button';
          icon: JSX.Element;
          label: string;
          href: string;
        } & StackProps)
      | {
          type: 'divider';
        }
    )[]
  >(
    () => [
      {
        type: 'button',
        icon: <Icon as={TbHome} boxSize={7} />,
        label: '?????????',
        href: '/dashboard',
      },
      {
        type: 'button',
        icon: <Icon as={TbClipboardList} boxSize={7} />,
        label: '?????????',
        href: '/timetable',
      },
      {
        type: 'button',
        icon: <Icon as={TbCalendar} boxSize={7} />,
        label: '??????????????????',
        href: '/events',
      },
      {
        type: 'button',
        icon: <Icon as={TbFileDescription} boxSize={7} />,
        label: '???????????????',
        href: '/posts/hatoboard',
      },
      {
        type: 'button',
        icon: <Icon as={TbBook2} boxSize={7} />,
        label: '?????????',
        href: '/library',
      },
      {
        type: 'divider',
      },
      {
        type: 'button',
        icon: <Icon as={TbSettings} boxSize={7} />,
        label: '??????',
        href: '/settings',
      },
      {
        type: 'button',
        icon: <Icon as={TbLogout} boxSize={7} />,
        label: '???????????????',
        href: '#',
        onClick: () => logout(),
        color: 'red.500',
      },
    ],
    [logout]
  );

  return (
    <VStack w="100%" h="100%" spacing={2} pb="env(safe-area-inset-bottom)">
      <HStack w="100%" spacing={0}>
        <Image src="/logo_alpha.png" boxSize={12} />
        {breakPoint !== 1 && (
          <Heading
            w="100%"
            p={2}
            pt={4}
            size="2xl"
            fontFamily="Josefin Sans, -apple-system, sans-serif"
          >
            Hato
          </Heading>
        )}
      </HStack>
      {menu.map(
        (menuItem, index) =>
          /* eslint-disable no-nested-ternary */
          menuItem.type === 'divider' ? (
            <StackDivider
              // eslint-disable-next-line react/no-array-index-key
              key={`${menuItem.type}-${index}`}
              borderWidth="1px"
              borderColor="border"
            />
          ) : breakPoint === 1 ? (
            <IconButton
              aria-label={menuItem.label}
              icon={menuItem.icon}
              size="lg"
              variant="ghost"
              isRound
              color={
                menuItem.color ??
                (location.pathname === menuItem.href ? 'blue.400' : undefined)
              }
              as={RouterLink}
              to={menuItem.href}
              onClick={
                menuItem.onClick as unknown as React.MouseEventHandler<HTMLButtonElement>
              }
            />
          ) : (
            <HStack
              p={2}
              key={menuItem.label}
              w="100%"
              spacing={4}
              color={
                location.pathname === menuItem.href ? 'blue.400' : undefined
              }
              layerStyle="button"
              rounded="xl"
              as={RouterLink}
              to={menuItem.href}
              {...menuItem}
            >
              {menuItem.icon}

              <Text
                color={
                  menuItem.color ??
                  (location.pathname === menuItem.href ? 'blue.400' : undefined)
                }
                textStyle="title"
                fontSize="lg"
              >
                {menuItem.label}
              </Text>
            </HStack>
          )
        /* eslint-enable no-nested-ternary */
      )}
      <Spacer />
      <Account />
    </VStack>
  );
}

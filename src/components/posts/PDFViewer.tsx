import React, { useState } from 'react';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Text,
  Link,
  Collapse,
  Progress,
  Spacer,
  Center,
  useBreakpointValue,
  Icon,
} from '@chakra-ui/react';
import { useQuery, useIsFetching } from '@tanstack/react-query';
import { TbExternalLink, TbX } from 'react-icons/tb';
import { AxiosError } from 'axios';
import { Document, Page } from 'react-pdf/dist/esm/entry.vite';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useClient } from '@/modules/client';
import Loading from '../common/Loading';
import Error from '../cards/Error';

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  attachment: Attachment;
}

const PDFViewer = React.memo(
  ({ isOpen, onClose, attachment }: PDFViewerProps) => {
    const { client } = useClient();
    const isFetching = useIsFetching(['post', 'attachment']);
    const pdfWidth = useBreakpointValue({
      base: window.innerWidth,
      md: undefined,
    });

    const { data, error, isLoading } = useQuery<ArrayBuffer, AxiosError>(
      ['post', 'attachment', attachment.id],
      async () =>
        (
          await client.get(`/post/attachment/${attachment.id}`, {
            responseType: 'arraybuffer',
          })
        ).data,
      {
        enabled: isOpen,
        staleTime: Infinity, // Infinity
      }
    );

    const [pageCount, setPageCount] = useState(0);

    return (
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom"
        size="full"
        allowPinchZoom
      >
        <DrawerOverlay />
        <DrawerContent top={0} bg="bg">
          <DrawerHeader shadow="xl" p={0}>
            <HStack align="center" w="100%" px={2} spacing={2}>
              <IconButton
                aria-label="close"
                icon={<Icon as={TbX} boxSize={6} />}
                size="lg"
                variant="ghost"
                onClick={onClose}
                isRound
              />
              <Text textStyle="title" whiteSpace="nowrap" noOfLines={1} py={4}>
                {attachment.name}
              </Text>
              <Spacer />
              <IconButton
                aria-label="open source link"
                icon={<Icon as={TbExternalLink} boxSize={6} />}
                size="lg"
                variant="ghost"
                as={Link}
                href={attachment.url ?? ''}
                isExternal
                isRound
              />
            </HStack>
            <Box w="100%">
              <Collapse in={!!isFetching}>
                <Progress w="100%" size="xs" isIndeterminate />
              </Collapse>
            </Box>
          </DrawerHeader>
          <DrawerBody p={0} position="relative" zIndex={-5}>
            <Center>
              {/* eslint-disable no-nested-ternary */}
              {isLoading ? (
                <Loading />
              ) : error ? (
                <Error error={error} />
              ) : (
                <Document
                  file={{
                    data,
                  }}
                  onLoadSuccess={(pdf) => {
                    setPageCount(pdf.numPages);
                  }}
                  loading={<Loading />}
                  // renderMode="svg"
                >
                  {Array.from(new Array(pageCount), (el, index) => (
                    <Center
                      key={`page_${index + 1}`}
                      py={2}
                      shadow="md"
                      maxW="100vw"
                    >
                      <Page
                        width={pdfWidth}
                        pageNumber={index + 1}
                        loading={<Loading />}
                      />
                    </Center>
                  ))}
                </Document>
              )}
              {/* eslint-enable no-nested-ternary */}
            </Center>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }
);

export default PDFViewer;

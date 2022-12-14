import React, { useState, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  HStack,
  Text,
  Textarea,
  VStack,
  Button,
  useToast,
  ModalProps,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { format } from 'date-fns/esm';
import { useMutation } from '@tanstack/react-query';
import { useClient } from '@/modules/client';
import { useUser } from '@/hooks/user';

interface ReportModalProps extends Omit<ModalProps, 'children'> {
  event?: Event;
  note?: Note;
  timetable?: boolean;
  placeholder?: string;
}

const ReportModal = React.memo(
  ({
    isOpen,
    onClose,
    event,
    note,
    timetable,
    placeholder,
  }: ReportModalProps) => {
    const toast = useToast({
      position: 'top-right',
      variant: 'left-accent',
    });
    const { data: user } = useUser();
    const { client } = useClient();

    const [reportType, setReportType] = useState('');
    const [reportComment, setReportComment] = useState('');

    const reportOptions = useMemo(
      () => [
        {
          label: '不正確な情報が含まれている',
          value: 'inaccurate information',
        },
        {
          label: '不適切なコンテンツである',
          value: 'Inappropriate content',
        },
        {
          label: 'その他',
          value: 'other',
        },
      ],
      []
    );

    const { mutate: reportSubmit, isLoading: reportLoading } = useMutation(
      () =>
        client.post('/report', {
          content: null,
          embeds: [
            event && {
              title: 'Report (Event)',
              url: `https://hato.cf/calendar/events/${event?._id}`,
              color: 5814783,
              fields: [
                {
                  name: 'Report reason',
                  value: reportType,
                },
                {
                  name: 'Comment',
                  value: reportComment || 'none',
                },
                {
                  name: 'Event title',
                  value: event.title,
                },
                {
                  name: 'Added by',
                  value: event.owner,
                },
              ],
              author: {
                name: user?.name,
                icon_url: user?.avatar,
              },
              footer: {
                text: user?.email,
                icon_url: user?.avatar,
              },
              timestamp: new Date().toISOString(),
            },
            note && {
              title: 'Report (Note)',
              url: `https://hato.cf/timetable/?y=${new Date(
                note.date
              ).getFullYear()}&m=${
                new Date(note.date).getMonth() + 1
              }&d=${new Date(note.date).getDate()}`,
              color: 5814783,
              fields: [
                {
                  name: 'Report reason',
                  value: reportType,
                },
                {
                  name: 'Comment',
                  value: reportComment || 'none',
                },
                {
                  name: 'Note date',
                  value: format(new Date(note.date), 'yyyy-MM-dd'),
                },
                {
                  name: 'Note message',
                  value: note.message,
                },
                {
                  name: 'Added by',
                  value: note.owner,
                },
              ],
              author: {
                name: user?.name,
                icon_url: user?.avatar,
              },
              footer: {
                text: user?.email,
                icon_url: user?.avatar,
              },
              timestamp: new Date().toISOString(),
            },
            timetable && {
              title: 'Report (Timetable)',
              url: `https://hato.cf/timetable/`,
              color: 5814783,
              fields: [
                {
                  name: 'Report reason',
                  value: reportType,
                },
                {
                  name: 'Comment',
                  value: reportComment || 'none',
                },
              ],
              author: {
                name: user?.name,
                icon_url: user?.avatar,
              },
              footer: {
                text: user?.email,
                icon_url: user?.avatar,
              },
              timestamp: new Date().toISOString(),
            },
          ].filter(Boolean),
          attachments: [],
        }),
      {
        onSuccess: () => {
          onClose();
          toast({
            title: '報告しました。',
            status: 'success',
          });
        },
        onError: () => {
          toast({
            title: 'エラーが発生しました。',
            status: 'error',
          });
        },
      }
    );

    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent rounded="xl" bg="panel">
          <ModalHeader>報告</ModalHeader>
          <ModalBody>
            <VStack align="flex-start">
              <Text textStyle="title">タイプを選択</Text>
              <Select
                options={reportOptions}
                chakraStyles={{
                  container: (provided) => ({
                    ...provided,
                    w: '100%',
                  }),
                  menu: (provided) => ({
                    ...provided,
                    shadow: 'lg',
                  }),
                }}
                onChange={(value) => setReportType(value?.label ?? '')}
              />
              <Text textStyle="title">コメント</Text>
              <Textarea
                placeholder={placeholder}
                rounded="lg"
                onChange={(e) => setReportComment(e.target.value)}
                isInvalid={reportType === 'その他' && !reportComment}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button variant="ghost" rounded="lg" onClick={onClose}>
                キャンセル
              </Button>
              <Button
                colorScheme="blue"
                rounded="lg"
                onClick={() => reportSubmit()}
                isLoading={reportLoading}
                isDisabled={
                  !reportType || (reportType === 'その他' && !reportComment)
                }
              >
                送信
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

export default ReportModal;

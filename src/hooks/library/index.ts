import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { librarySearchAtom } from '@/store/library';

// eslint-disable-next-line import/prefer-default-export
export const useLibrarySearch = (
  options?: UseMutationOptions<
    LibrarySearchResponse,
    AxiosError,
    'free' | 'detail'
  >
) => {
  const { free, ...params } = useRecoilValue(librarySearchAtom);
  const [searchParams, setSearchParams] = useSearchParams();

  return useMutation<LibrarySearchResponse, AxiosError, 'free' | 'detail'>(
    ['library', 'search', { free, ...params }],
    async (type) => {
      [...searchParams.keys()].forEach((key) => searchParams.delete(key));
      if (type === 'free') {
        searchParams.set('free', free ?? '');
      } else {
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.set(key, String(value));
        });
      }
      setSearchParams(searchParams, { replace: true });

      const books = [];
      let count;
      let version = 1;
      let running;
      const res = (
        await axios.get<LibrarySearchResponse>(
          'https://unitrad.calil.jp/v1/search',
          {
            params: {
              ...params,
              free: type === 'free' ? free : undefined,
              region: 'gk-2004103-auf08',
            },
          }
        )
      ).data;
      books.push(...res.books);
      running = res.running;
      count = res.count;

      while (running) {
        // wait 500ms for polling
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => {
          setTimeout(r, 500);
        });
        const pollingRes = (
          await axios.get<LibrarySearchDiffResponse>( // eslint-disable-line no-await-in-loop
            'https://unitrad.calil.jp/v1/polling',
            { params: { uuid: res.uuid, version, diff: 1 } }
          )
        ).data;
        // eslint-disable-next-line no-continue
        if (!pollingRes) continue;
        books.push(...pollingRes.books_diff.insert);
        running = pollingRes.running;
        version = pollingRes.version;
        count = pollingRes.count;
      }

      return { ...res, books, count };
    },
    {
      ...options,
    }
  );
};

export const useBookInfo = (isbn: string) =>
  useQuery<Book, AxiosError>(['library', 'book', isbn], async () => {
    const books = [];
    let running;
    let version = 1;
    const res = (
      await axios.get<LibrarySearchResponse>(
        'https://unitrad.calil.jp/v1/search',
        { params: { isbn, region: 'gk-2004103-auf08' } }
      )
    ).data;
    books.push(...res.books);
    running = res.running;
    while (running) {
      // wait 500ms for polling
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => {
        setTimeout(r, 500);
      });
      const pollingRes = (
        await axios.get<LibrarySearchDiffResponse>( // eslint-disable-line no-await-in-loop
          'https://unitrad.calil.jp/v1/polling',
          { params: { uuid: res.uuid, version, diff: 1 } }
        )
      ).data;
      // eslint-disable-next-line no-continue
      if (!pollingRes) continue;
      books.push(...pollingRes.books_diff.insert);

      running = pollingRes.running;
      version = pollingRes.version;
    }

    return books[0];
  });

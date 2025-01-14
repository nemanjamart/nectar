import { IDocsEntity } from '@api';
import { CloseIcon, DownloadIcon } from '@chakra-ui/icons';
import { Box, Link } from '@chakra-ui/layout';
import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { OrcidActiveIcon } from '@components/icons/Orcid';
import { Pagination } from '@components/ResultList/Pagination';
import { usePagination } from '@components/ResultList/Pagination/usePagination';
import { useDebounce } from '@hooks/useDebounce';
import { useGetAffiliations } from '@_api/search';
import { saveAs } from 'file-saver';
import { matchSorter } from 'match-sorter';
import NextLink from 'next/link';
import { ChangeEventHandler, forwardRef, MouseEventHandler, ReactElement, useEffect, useRef, useState } from 'react';
import { useGetAuthors } from './useGetAuthors';

export interface IAllAuthorsModalProps {
  bibcode: IDocsEntity['bibcode'];
  label: string;
}

export const AllAuthorsModal = ({ bibcode, label }: IAllAuthorsModalProps): ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  // to avoid having to play with the forwarded ref, just focus here
  const handleSearchClear = () => {
    if (initialRef.current) {
      initialRef.current.focus();
    }
  };

  // get list of authors/affiliations
  const { data, isSuccess, isFetching } = useGetAffiliations(
    { bibcode },
    {
      enabled: isOpen,
      keepPreviousData: true,
      onError: () => {
        toast({
          title: 'Error',
          description: 'Could not fetch author information, please try again',
          status: 'error',
        });
        onClose();
      },
    },
  );

  return (
    <>
      <Button variant={'link'} fontStyle="italic" onClick={onOpen}>
        {label}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef} size="4xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            {isSuccess && (
              <Box id="author-list-description">
                <Text size="lg">Author list for </Text>
                <Text size="xl" fontWeight="bold">
                  {data.docs[0].title}
                </Text>
              </Box>
            )}
          </ModalHeader>
          <ModalBody px={0}>
            {isFetching && (
              <Flex justifyContent={'center'}>
                <Spinner size="xl" />
              </Flex>
            )}
            {isSuccess && <AuthorsTable doc={data.docs[0]} ref={initialRef} onSearchClear={handleSearchClear} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const getLinkProps = (queryType: 'author' | 'orcid', value: string) => ({
  href: {
    pathname: '/search',
    query: {
      q: queryType === 'author' ? `author:"${value}"` : `orcid:"${value}"`,
      sort: 'date desc, bibcode desc',
    },
  },
  passHref: true,
});

const AuthorsTable = forwardRef<HTMLInputElement, { doc: IDocsEntity; onSearchClear: () => void }>(
  ({ doc, onSearchClear }, ref) => {
    // process doc (extracts author information)
    const authors = useGetAuthors({ doc });
    const [list, setList] = useState(authors);
    const [searchVal, setSearchVal] = useState('');
    const debSearchVal = useDebounce(searchVal, 500);

    // fill list with authors when it finishes loading
    useEffect(() => setList(authors), [authors]);

    // filter list when searchval changes
    useEffect(
      () =>
        setList(
          debSearchVal === ''
            ? authors
            : matchSorter(authors, debSearchVal, {
                keys: ['1', '2'],
                threshold: matchSorter.rankings.WORD_STARTS_WITH,
              }),
        ),
      [debSearchVal, authors],
    );

    const pagination = usePagination({ numFound: list.length, updateURL: false });

    // update search val on input change
    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      setSearchVal(e.currentTarget.value);
    };

    // clear input and update list
    const handleInputClear = () => {
      setSearchVal('');
      setList(authors);
      onSearchClear();
    };

    // handle the download button
    const handleDownloadClick: MouseEventHandler = () => {
      const csvBlob = new Blob(
        [
          authors.reduce(
            (acc, [a = '', b = '', c = '', d = '']) => `${acc}"${a}","${b}","${c}","${d}"\n`,
            'position,name,affiliation,orcid\n',
          ),
        ],
        { type: 'text/csv;charset=utf-8' },
      );
      saveAs(csvBlob, `${doc.bibcode}-authors.csv`);
    };

    const renderRows = () => {
      return (
        <>
          {list.slice(pagination.startIndex, pagination.endIndex).map((item, index) => {
            const [position, author, aff, orcid] = item;
            return (
              <Tr key={`${author}${index}`}>
                {}
                <Td display={{ base: 'none', sm: 'table-cell' }}>
                  <Text>{position}.</Text>
                </Td>
                <Td>
                  {typeof author === 'string' && (
                    <NextLink {...getLinkProps('author', author)}>
                      <Link px={1} aria-label={`author "${author}", search by name`} flexShrink="0">
                        {author}
                      </Link>
                    </NextLink>
                  )}
                </Td>
                <Td>
                  {typeof orcid === 'string' && (
                    <NextLink {...getLinkProps('orcid', orcid)}>
                      <Link aria-label={`author "${author}", search by orKid`}>
                        <OrcidActiveIcon fontSize={'large'} />
                      </Link>
                    </NextLink>
                  )}
                </Td>
                <Td>
                  <Text>{aff}</Text>
                </Td>
              </Tr>
            );
          })}
        </>
      );
    };

    return (
      <Box as="section" aria-describedby="author-list-description" position="relative" pt="75px" overflow="hidden">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          position="absolute"
          top="0"
          left="0"
          width="100%"
          px={6}
          boxSizing="border-box"
        >
          <InputGroup size="md" width="sm">
            <Input placeholder="Search authors" value={searchVal} onChange={handleInputChange} ref={ref} />
            <InputRightElement>
              <IconButton
                icon={<CloseIcon />}
                variant="unstyled"
                aria-label="clear"
                size="sm"
                hidden={searchVal.length <= 0}
                onClick={handleInputClear}
              />
            </InputRightElement>
          </InputGroup>
          <Tooltip label="Download list as CSV file">
            <IconButton
              icon={<DownloadIcon />}
              size="md"
              ml="4"
              onClick={handleDownloadClick}
              aria-label="Download list as CSV file"
            />
          </Tooltip>
        </Flex>
        <Box px={6} boxSizing="border-box">
          {list.length > 0 && (
            <>
              <Table>
                <Thead>
                  <Tr>
                    <Th display={{ base: 'none', sm: 'table-cell' }}></Th>
                    <Th>Name</Th>
                    <Th>ORCiD</Th>
                    <Th>Affliation</Th>
                  </Tr>
                </Thead>
                <Tbody>{renderRows()}</Tbody>
              </Table>
            </>
          )}
          <Pagination totalResults={list.length} {...pagination} perPageMenuPlacement="top"></Pagination>
        </Box>
      </Box>
    );
  },
);

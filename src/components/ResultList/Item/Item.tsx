import { IDocsEntity } from '@api';
import { Checkbox } from '@chakra-ui/checkbox';
import { Box, Flex, Link, Stack, Text } from '@chakra-ui/layout';
import { useIsClient } from '@hooks/useIsClient';
import { useStore } from '@store';
import { getFomattedNumericPubdate } from '@utils';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { ChangeEvent, ReactElement, useCallback } from 'react';
import shallow from 'zustand/shallow';
import { IAbstractPreviewProps } from './AbstractPreview';
import { ItemResourceDropdowns } from './ItemResourceDropdowns';

const AbstractPreview = dynamic<IAbstractPreviewProps>(
  () => import('./AbstractPreview').then((mod) => mod.AbstractPreview),
  { ssr: false },
);
export interface IItemProps {
  doc: IDocsEntity;
  index: number;
  hideCheckbox: boolean;
  hideActions: boolean;
  set?: boolean;
  clear?: boolean;
  onSet?: (check: boolean) => void;
  useNormCite?: boolean;
}

export const Item = (props: IItemProps): ReactElement => {
  const { doc, index, hideCheckbox = false, hideActions = false, useNormCite } = props;
  const { bibcode, pubdate, title = ['Untitled'], author = [], bibstem = [], author_count } = doc;
  const formattedPubDate = getFomattedNumericPubdate(pubdate);
  const [formattedBibstem] = bibstem;
  const isClient = useIsClient();

  // memoize the isSelected callback on bibcode
  const isChecked = useStore(useCallback((state) => state.isDocSelected(bibcode), [bibcode]));

  // citations
  const cite = useNormCite ? (
    typeof doc.citation_count_norm === 'number' && doc.citation_count_norm > 0 ? (
      <NextLink href={`/abs/[id]/citations`} as={`/abs/${bibcode}/citations`} passHref>
        <Link>
          <Text>cited(n): {doc.citation_count_norm}</Text>
        </Link>
      </NextLink>
    ) : null
  ) : typeof doc.citation_count === 'number' && doc.citation_count > 0 ? (
    <NextLink href={`/abs/[id]/citations`} as={`/abs/${bibcode}/citations`} passHref>
      <Link>cited: {doc.citation_count}</Link>
    </NextLink>
  ) : null;

  return (
    <Flex direction="row" as="article" border="1px" borderColor="gray.50" mb={1} borderRadius="md">
      <Flex
        direction="row"
        backgroundColor={isChecked ? 'blue.500' : 'gray.50'}
        justifyContent="center"
        alignItems="center"
        mr="2"
        px="2"
        borderLeftRadius="md"
      >
        <Text color={isChecked ? 'white' : 'initial'} display={{ base: 'none', md: 'initial' }} mr={1}>
          {index.toLocaleString()}
        </Text>
        {hideCheckbox ? null : <ItemCheckbox index={index} bibcode={bibcode} title={title} isChecked={isChecked} />}
      </Flex>
      <Stack direction="column" width="full" spacing={0} mx={3} mt={2}>
        <Flex justifyContent="space-between">
          <NextLink href={`/abs/[id]/abstract`} as={`/abs/${bibcode}/abstract`} passHref>
            <Link fontWeight="semibold">
              <span dangerouslySetInnerHTML={{ __html: title[0] }}></span>
            </Link>
          </NextLink>
          <Flex alignItems="start" ml={1}>
            {!isClient || hideActions ? null : <ItemResourceDropdowns doc={doc} />}
          </Flex>
        </Flex>
        <Flex direction="column">
          {author.length > 0 && (
            <Box fontSize="sm">
              {author.slice(0, 10).join('; ')}
              {author_count > 10 && (
                <Text as="span" fontStyle="italic">
                  {' '}
                  and {author_count - 10} more
                </Text>
              )}
            </Box>
          )}
          <Text fontSize="xs" mt={0.5}>
            {formattedPubDate}
            {formattedPubDate && formattedBibstem ? <span className="px-2">·</span> : ''}
            {formattedBibstem}
            {cite && (formattedPubDate || formattedBibstem) ? <span className="px-2">·</span> : null}
            {cite}
          </Text>
          <AbstractPreview bibcode={bibcode} />
        </Flex>
      </Stack>
    </Flex>
  );
};

const ItemCheckbox = (props: { index: number; bibcode: string; title: string[]; isChecked: boolean }) => {
  const { index, bibcode, title, isChecked } = props;

  const [selectDoc, unSelectDoc] = useStore((state) => [state.selectDoc, state.unSelectDoc], shallow);

  // on select, update the local state and appState
  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    checked ? selectDoc(bibcode) : unSelectDoc(bibcode);
  };

  return (
    <Checkbox
      name={`result-checkbox-${index}`}
      id={`result-checkbox-${index}`}
      onChange={handleSelect}
      isChecked={isChecked}
      aria-label={`${isChecked ? 'De-select' : 'Select'} item ${title[0]}`}
      size="md"
    />
  );
};

import { Box, Flex, Grid, GridItem, Heading, Text } from '@chakra-ui/layout';
import { useStore, useStoreApi } from '@store';
import { noop } from '@utils';
import { FC, HTMLAttributes, MouseEventHandler, useMemo } from 'react';
import { examples } from './examples';

export interface ISearchExamplesProps extends HTMLAttributes<HTMLDivElement> {
  onSelect?: () => void;
}

export const SearchExamples: FC<ISearchExamplesProps> = (props) => {
  const { onSelect = noop, ...divProps } = props;
  const theme = useStore((state) => state.theme);
  const updateQuery = useStore((state) => state.updateQuery);
  const store = useStoreApi();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const text = e.currentTarget.dataset['text'];
    const query = store.getState().query;

    // Add our text to the end of the query
    updateQuery({ q: `${query.q}${query.q.length > 0 ? ' ' : ''}${text}` });

    // fire select callback
    onSelect();
    return undefined;
  };

  // memoize left/right examples
  const [leftExamples, rightExamples] = useMemo(
    () => [
      examples[theme].left.map(({ label, text }) => (
        <SearchExample label={label} example={text} key={label} data-text={text} onClick={handleClick} />
      )),
      examples[theme].right.map(({ label, text }) => (
        <SearchExample label={label} example={text} key={label} data-text={text} onClick={handleClick} />
      )),
    ],
    [theme],
  );

  return (
    <Flex justifyContent="center" direction="column" alignItems="center" {...divProps}>
      <Heading as="h3" size="md" mt={3} mb={5}>
        Search Examples
      </Heading>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={5}>
        <GridItem>{leftExamples}</GridItem>
        <GridItem>{rightExamples}</GridItem>
      </Grid>
    </Flex>
  );
};

interface ISearchExampleProps extends HTMLAttributes<HTMLElement> {
  label: string;
  example: string;
}

const SearchExample = (props: ISearchExampleProps) => {
  const { label, example, ...buttonProps } = props;
  return (
    <Grid templateColumns="1fr 2fr" gap={3} my={1}>
      <Text align="right" fontWeight="semibold" py={2}>
        {label}
      </Text>
      <Box
        as="button"
        type="button"
        sx={{
          borderRadius: '0',
          border: 'var(--chakra-colors-gray-200) 1px dotted',
          _hover: { backgroundColor: 'gray.50' },
          fontWeight: 'normal',
          overflowWrap: 'break-all',
          padding: '2',
          display: 'flex',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        {...buttonProps}
      >
        {example}
      </Box>
    </Grid>
  );
};

// fallback component to be used as a placeholder
export const SearchExamplesPlaceholder = () => {
  return (
    <Flex justifyContent="center" direction="column" alignItems="center">
      <Heading as="h3" size="md" mt={3} mb={5}>
        Search Examples
      </Heading>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={5}>
        <GridItem>
          {examples['GENERAL'].left.map(({ label, text }) => (
            <SearchExample label={label} example={text} key={label} data-text={text} />
          ))}
        </GridItem>
        <GridItem>
          {examples['GENERAL'].right.map(({ label, text }) => (
            <SearchExample label={label} example={text} key={label} data-text={text} />
          ))}
        </GridItem>
      </Grid>
    </Flex>
  );
};

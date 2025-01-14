import { Stack, Box } from '@chakra-ui/layout';
import { range } from 'ramda';
import { ReactElement } from 'react';
import { Skeleton, SkeletonText } from '@chakra-ui/skeleton';

export interface ISkeletonProps {
  count: number;
}

export const ItemsSkeleton = (props: ISkeletonProps): ReactElement => {
  const { count } = props;

  return (
    <>
      {range(0, count).map((i) => (
        <Box border="1px" borderColor="gray.50" margin={2} borderRadius="md" padding={2} key={i.toString()}>
          <Stack direction="column" width="full">
            <Skeleton height={3} width="100%" />
            <Skeleton height={3} width="50%" />
            <SkeletonText width="75%" noOfLines={1} />
            <SkeletonText width="50%" noOfLines={1} />
          </Stack>
        </Box>
      ))}
    </>
  );
};

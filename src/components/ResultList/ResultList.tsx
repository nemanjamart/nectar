import { IDocsEntity, SolrSort } from '@api';
import { ISearchMachine, TransitionType } from '@machines/lib/search/types';
import { isBrowser } from '@utils';
import { useSelector } from '@xstate/react';
import React, { HTMLAttributes, ReactElement, useEffect, useState } from 'react';
import { Item } from './Item/Item';
import { ListActions } from './ListActions';
import { Pagination } from './Pagination/Pagination';
import { Skeleton } from './Skeleton';
export interface IResultListProps extends HTMLAttributes<HTMLDivElement> {
  docs: IDocsEntity[];
  hideCheckboxes?: boolean;
  isLoading?: boolean;
  service?: ISearchMachine;
  showActions: boolean;
  query: string;
  sort: SolrSort[];
  page: number;
}

interface ISelection {
  selectAll: boolean;
  selectNone: boolean;
  selectedCount: number;
}

export const ResultList = (props: IResultListProps): React.ReactElement => {
  const [selection, setSelection] = useState<ISelection>({
    selectAll: false,
    selectNone: false,
    selectedCount: 0,
  });

  const {
    docs = [],
    isLoading = false,
    hideCheckboxes = false,
    service: searchService,
    showActions,
    query,
    sort,
    page,
    ...divProps
  } = props;

  const numPerPage = useSelector(searchService, (state) => {
    return state.context.pagination.numPerPage;
  });

  const handleSortChange = () => {};

  const handleSelectAll = () => {
    setSelection({
      selectAll: true,
      selectNone: false,
      selectedCount: total,
    });
  };

  const handleSelectNone = () => {
    setSelection({
      selectAll: false,
      selectNone: true,
      selectedCount: 0,
    });
  };

  const handleLimitedTo = () => {};

  const handleExclude = () => {};

  const handleItemSet = (check) => {
    setSelection({
      selectAll: false,
      selectNone: false,
      selectedCount: check ? selection.selectedCount + 1 : selection.selectedCount - 1,
    });
  };

  const indexStart = useSelector(searchService, (state) => {
    const { page, numPerPage } = state.context.pagination;
    return (page - 1) * numPerPage + 1;
  });

  const total = useSelector(searchService, (state) => {
    const t = state.context.result.numFound;
    const { page, numPerPage } = state.context.pagination;
    const pages = Math.floor(t / numPerPage) + 1;
    return page === pages ? t % numPerPage : numPerPage;
  });

  useEffect(() => {
    setSelection({
      selectAll: false,
      selectNone: false,
      selectedCount: 0,
    });
  }, [indexStart]);

  return (
    <article {...divProps} className="flex flex-col mt-1 space-y-1">
      <div>
        {isLoading || !showActions ? null : (
          <ListActions
            service={searchService}
            selectedCount={selection.selectedCount}
            totalCount={total}
            onSortChange={handleSortChange}
            onSelectAll={handleSelectAll}
            onSelectNone={handleSelectNone}
            onLimitedTo={handleLimitedTo}
            onExclude={handleExclude}
            query={query}
            sort={sort}
            page={page}
          />
        )}
      </div>
      {isLoading ? (
        <Skeleton count={10} />
      ) : docs.length > 0 ? (
        <>
          {docs.map((doc, index) => (
            <Item
              doc={doc}
              key={doc.id}
              index={indexStart + index}
              hideCheckbox={!isBrowser() ? true : hideCheckboxes}
              set={selection.selectAll}
              clear={selection.selectNone}
              onSet={handleItemSet}
            />
          ))}
          {/* footer */}
          <PaginationWrapper searchService={searchService} />
        </>
      ) : (
        <div className="flex items-center justify-center text-lg">No Results Found</div>
      )}
    </article>
  );
};

const PaginationWrapper = ({ searchService }: { searchService: ISearchMachine }): ReactElement => {
  const totalResults = useSelector(searchService, (state) => state.context.result.numFound);
  const numPerPage = useSelector(searchService, (state) => state.context.pagination.numPerPage);

  const updatePagination = (page: number) => {
    searchService.send(TransitionType.SET_PAGINATION, { payload: { pagination: { page } } });
  };

  return <Pagination totalResults={totalResults} numPerPage={numPerPage} onPageChange={updatePagination} />;
};

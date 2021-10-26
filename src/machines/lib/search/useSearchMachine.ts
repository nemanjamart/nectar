import Adsapi, { IADSApiSearchParams } from '@api';
import { AppEvent, useAppCtx } from '@store';
import { useInterpret, useSelector } from '@xstate/react';
import { useRouter } from 'next/router';
import qs from 'qs';
import { initialContext, searchMachine } from './searchMachine';
import { Context, Transition } from './types';

export interface IUseSearchMachineProps {
  initialResult?: Context['result'];
  initialParams?: Context['params'];
  initialPagination?: Context['pagination'];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useSearchMachine(props: IUseSearchMachineProps = {}) {
  const { initialResult, initialParams, initialPagination } = props;
  const {
    dispatch,
    state: {
      user: { access_token: token },
    },
  } = useAppCtx();

  const Router = useRouter();

  const initialState = {
    ...initialContext,
    ...(initialResult && { result: initialResult }),
    ...(initialParams && { params: initialParams }),
    ...(initialPagination && { pagination: initialPagination }),
  };
  const service = useInterpret<Context, Transition>(searchMachine.withContext(initialState), {
    devTools: true,
    services: {
      fetchResult: async (ctx: Context) => {
        if (ctx.params.q === '' || typeof ctx.params.q === 'undefined') {
          throw new Error('no query');
        }
        const { q, sort, start } = ctx.params;

        const params: IADSApiSearchParams = {
          q,
          fl: ['bibcode', 'title', 'author', '[fields author=10]', 'author_count', 'pubdate', 'bibstem'],
          ...ctx.params,
        };

        const adsapi = new Adsapi({ token });
        const result = await adsapi.search.query(params);

        if (result.isErr()) {
          console.error(result.error);
          throw result.error;
        }

        dispatch({ type: AppEvent.SET_CURRENT_QUERY, payload: params });

        const page = start === 0 ? 1 : ctx.pagination.page;

        // update the url with the updated query and sort
        const queryParams = qs.stringify({ q, sort, p: page }, { arrayFormat: 'comma' });
        const updatedPath = `/search?${queryParams}`;

        if (updatedPath !== Router.asPath) {
          void Router.push(updatedPath, undefined, { shallow: true });
        }

        const { docs, numFound } = result.value;
        return { docs, numFound };
      },
    },
  });

  const state = {
    service,
    result: useSelector(service, (state) => state.context.result),
    error: useSelector(service, (state) => state.context.error),
    isLoading: useSelector(service, (state) => state.matches('fetching')),
    isFailure: useSelector(service, (state) => state.matches('failure')),
  };

  return state;
}

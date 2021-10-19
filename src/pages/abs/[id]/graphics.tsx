import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { getDocument, normalizeURLParams } from '@utils';
import Link from 'next/link';
import AdsApi, { IADSApiGraphicsParams, IADSApiGraphicsResponse, IDocsEntity, IUserData } from '@api';
import { AbsLayout } from '@components/Layout/AbsLayout';
import Image from 'next/image';
interface IGraphicsPageProps {
  graphics?: IADSApiGraphicsResponse;
  originalDoc: IDocsEntity;
  error?: string;
  hasGraphics: boolean;
  hasMetrics: boolean;
}

const GraphicsPage: NextPage<IGraphicsPageProps> = (props: IGraphicsPageProps) => {
  const { originalDoc, graphics, error, hasGraphics, hasMetrics } = props;
  return (
    <AbsLayout doc={originalDoc} hasGraphics={hasGraphics} hasMetrics={hasMetrics}>
      <article aria-labelledby="title" className="flex-1 my-8 px-4 py-8 w-full bg-white shadow sm:rounded-lg">
        <div className="border-b border-gray-200 sm:pb-0 md:pb-3">
          <h2 className="prose-xl text-gray-900 font-medium leading-6" id="title">
            <em>Graphics from</em> <strong>{originalDoc.title}</strong>
          </h2>
          {error ?? <div className="my-2" dangerouslySetInnerHTML={{ __html: graphics.header }}></div>}
        </div>
        {error ? (
          <div className="flex items-center justify-center w-full h-full text-xl">{error}</div>
        ) : (
          <div className="flex flex-wrap">
            {graphics.figures.map((figure, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-between m-2 p-2 border-2 border-gray-100 rounded-lg"
                >
                  <Link href={figure.images[0].highres}>
                    <a target="_blank" rel="noreferrer noopener" className="relative">
                      <Image
                        src={figure.images[0].thumbnail}
                        width="150"
                        height="150"
                        className="p-5"
                        alt={figure.figure_label}
                      ></Image>
                    </a>
                  </Link>
                  <span aria-hidden="true">{figure.figure_label}</span>
                </div>
              );
            })}
          </div>
        )}
      </article>
    </AbsLayout>
  );
};

export default GraphicsPage;

export const getServerSideProps: GetServerSideProps<IGraphicsPageProps> = async (ctx) => {
  const query = normalizeURLParams(ctx.query);
  const request = ctx.req as typeof ctx.req & {
    session: { userData: IUserData };
  };
  const userData = request.session.userData;
  const params: IADSApiGraphicsParams = {
    bibcode: query.id,
  };
  const adsapi = new AdsApi({ token: userData.access_token });
  const result = await adsapi.graphics.query(params);
  const originalDoc = await getDocument(adsapi, query.id);
  const hasGraphics =
    !originalDoc.notFound && !originalDoc.error ? await adsapi.graphics.hasGraphics(adsapi, params.bibcode) : false;
  const hasMetrics =
    !originalDoc.notFound && !originalDoc.error ? await adsapi.metrics.hasMetrics(adsapi, params.bibcode) : false;

  return originalDoc.notFound || originalDoc.error
    ? { notFound: true }
    : result.isErr()
    ? {
        props: {
          graphics: null,
          originalDoc: originalDoc.doc,
          hasGraphics,
          hasMetrics,
          error: 'Unable to get results',
        },
      }
    : {
        props: {
          graphics: result.value,
          originalDoc: originalDoc.doc,
          hasGraphics,
          hasMetrics,
        },
      };
};

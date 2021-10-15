import { IDocsEntity } from '@api';
import React from 'react';
import Head from 'next/head';
import { Esources } from '@api/lib/search/types';

interface IMetatagsProps {
  doc: IDocsEntity;
}

export const Metatags = (props: IMetatagsProps): React.ReactElement => {
  const { doc } = props;

  if (!doc) {
    return null;
  }

  const getFomattedNumericPubdate = (pubdate: string) => {
    const regex = /(....)-(..)-(..)/;
    const res = regex.exec(pubdate);
    return `${res[1]}/${res[2]}`;
  };

  const getLastPage = (page_range: string) => {
    const pages = page_range.split('-');
    return pages[1];
  };

  const getArXiv = (identifier: string[]) => {
    identifier.forEach((id) => {
      if (id.startsWith('arXiv')) {
        return id;
      }
    });
    return '';
  };

  console.log(doc);
  const title = doc.title ? doc.title.join('; ') : '';
  const url = `https://ui.adsabs.harvard.edu/abs/${doc.bibcode}/abstract`;
  const logo = 'https://ui.adsabs.harvard.edu/styles/img/transparent_logo.svg';
  const formatted_numeric_pubdate = doc.pubdate ? getFomattedNumericPubdate(doc.pubdate) : '';
  const last_page = doc.page_range ? getLastPage(doc.page_range) : '';
  const arXiv = doc.identifier ? getArXiv(doc.identifier) : '';

  return (
    <Head>
      <meta property="og:type" content={doc.doctype} />

      <meta property="og:title" content={title} />

      <meta property="og:site_name" content="NASA/ADS" />

      <meta property="og:description" content={doc.abstract} />

      <meta property="og:url" content={url} />

      <meta property="og:image" content={logo} />

      {doc.pubdate && <meta property="article:published_time" content={formatted_numeric_pubdate} />}

      {doc.author && doc.author.map((a, i) => <meta key={`aa-${i}`} name="article:author" content={a} />)}

      {doc.doctype === 'Proceedings' ? (
        doc.bibstem && doc.bibstem.length > 0 && <meta name="citation_conference" content={doc.bibstem[0]} />
      ) : doc.pub ? (
        <meta name="citation_journal_title" content={doc.pub} />
      ) : null}

      {doc.pubdate && <meta name="citation_date" content={formatted_numeric_pubdate} />}

      {doc.author && doc.author.map((a, i) => <meta key={`ca-${i}`} name="citation_authors" content={a} />)}

      {doc.title && <meta name="citation_title" content={title} />}

      {doc.pubdate && <meta name="citation_date" content={formatted_numeric_pubdate} />}

      {doc.volume && <meta name="citation_volume" content={doc.volume} />}

      {doc.issue && <meta name="citation_issue" content={doc.issue} />}

      {doc.page && <meta name="citation_firstpage" content={doc.page} />}

      {doc.doi && doc.doi.length > 0 && <meta name="citation_doi" content={doc.doi[0]} />}

      {doc.issn && doc.issn.length > 0 && <meta name="citation_issn" content={doc.issn[0]} />}

      {doc.isbn && doc.isbn.length > 0 && <meta name="citation_isbn" content={doc.isbn[0]} />}

      <meta name="citation_language" content="en" />

      {doc.keyword && <meta name="citation_keywords" content={doc.keyword.join('; ')} />}

      {doc.doctype === 'PhD Thesis' && <meta name="citation_dissertation_name" content="Phd" />}

      {doc.doctype === 'Masters Thesis' && <meta name="citation_dissertation_name" content="MS" />}

      <meta name="citation_abstract_html_url" content={url} />

      {doc.pubdate && <meta name="citation_publication_date" content={formatted_numeric_pubdate} />}

      {doc.aff && doc.aff.map((a) => <meta key={a} name="citation_author_institution" content={a} />)}

      {doc.esources && doc.esources.find((e) => e === Esources.PUB_PDF) && (
        <meta name="citation_pdf_url" content={`https://ui.adsabs.harvard.edu/link_gateway/${doc.bibcode}/PUB_PDF`} />
      )}

      {doc.page_range && <meta name="citation_lastpage" content={last_page} />}

      {arXiv !== '' && <meta name="citation_arxiv_id" content={arXiv} />}

      <link title="schema(PRISM)" rel="schema.prism" href="http://prismstandard.org/namespaces/1.2/basic/" />

      {doc.pubdate && <meta name="prism.publicationDate" content={formatted_numeric_pubdate} />}

      {doc.bibstem && doc.bibstem.length > 0 && <meta name="prism.publicationName" content={doc.bibstem[0]} />}

      {doc.issn && doc.issn.length > 0 && <meta name="prism.issn" content={doc.issn[0]} />}

      {doc.volume && <meta name="prism.volume" content={doc.volume} />}

      {doc.page && <meta name="prism.startingPage" content={doc.page} />}

      {doc.page_range && <meta name="prism.endingPage" content={last_page} />}

      <link title="schema(DC)" rel="schema.dc" href="http://purl.org/dc/elements/1.1/" />

      {doc.doi && doc.doi.length > 0 && <meta name="dc.identifier" content={`doi:${doc.doi[0]}`} />}

      {doc.pubdate && <meta name="dc.date" content={formatted_numeric_pubdate} />}

      {doc.bibstem && doc.bibstem.length > 0 && <meta name="dc.source" content={doc.bibstem[0]} />}

      <meta name="dc.title" content={title} />

      {doc.author && doc.author.map((a, i) => <meta key={`dcc-${i}`} name="dc.creator" content={a} />)}

      <meta name="twitter:card" content="summary_large_image" />

      <meta name="twitter:description" content={doc.abstract} />

      <meta name="twitter:title" content={title} />

      <meta name="twitter:site" content="@adsabs" />

      <meta name="twitter:domain" content="NASA/ADS" />

      <meta name="twitter:image:src" content={logo} />

      <meta name="twitter:creator" content="@adsabs" />
    </Head>
  );
};
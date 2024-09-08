import type { PropsWithChildren } from 'react';
import type React from 'react';
import { Helmet } from 'dumi';

import Footer from '../../slots/Footer';

const IndexLayout: React.FC<PropsWithChildren<{ title: string; desc: string }>> = ({
  children,
  ...restProps
}) => (
  <>
    <Helmet>
      <title>{restProps.title}</title>
      <meta property="og:title" content={restProps.title} />
      {restProps.desc && <meta name="description" content={restProps.desc} />}
    </Helmet>
    <div style={{ minHeight: '100vh' }}>{children}</div>
    <Footer />
  </>
);

export default IndexLayout;

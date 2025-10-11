import type { ReactNode } from 'react';

export type BlogProps = {
  headingId?: string;
  headingLabel?: string;
  children: ReactNode;
};

export const Blog = ({
  headingId = 'blog-heading',
  headingLabel = 'About this visualization',
  children,
}: BlogProps) => {
  return (
    <section className="mb-6" aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {headingLabel}
      </h2>
      {children}
    </section>
  );
};

export default Blog;

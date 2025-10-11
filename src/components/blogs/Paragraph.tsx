import React from 'react';

export type ParagraphProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

export function Paragraph({
  children,
  className = '',
  as: Component = 'p',
}: ParagraphProps) {
  return (
    <Component className={`blog-paragraph ${className}`}>
      {children}
    </Component>
  );
}
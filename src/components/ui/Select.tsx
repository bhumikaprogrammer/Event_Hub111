import React from 'react';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
  return (
    <div className="flex justify-between items-center mb-6 pb-4 border-b">
      <h1 className="text-3xl font-bold">{title}</h1>
      {children && <div>{children}</div>}
    </div>
  );
};
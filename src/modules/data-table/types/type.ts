// @ts-ignore
import type { ReactElement, ReactNode } from "react";

export type RowData = Record<string, unknown>;

export type ColumnDefinition<TData extends RowData> = {
  header?: ReactNode;
  accessor: Extract<keyof TData, string>;
  value?: ReactNode | ((row: TData) => ReactNode);
  columnClassName?: string;
  th?: string;
  cellContentWrapperClassName?: string;
  td?: string;
  isSortable?: boolean;
  skeleton?: ReactNode;
};

export type TableChildren<TData extends RowData> = ReactElement<
  ColumnDefinition<TData>
>;

import clsx from "clsx";
import type { ReactNode } from "react";
import { getClassNames } from "../../common/utils/getClassNames";
import { SortOrderEnum } from "../../search-query/types/SortOrder";
import { useColumnsOrChildren } from "../hooks/useColumnsOrChildren";
import type { ColumnDefinition, TableChildren } from "../types/type";

type ClassNames = {
  thead?: string;
  tbody?: string;
  table?: string;
  headRow?: string;
  bodyRow?: string;
  tr?: string;
  th?: string;
  td?: string;
};

type TableProps<TData extends Record<string, unknown>> = {
  data: TData[];
  className?: ClassNames | string;
  sortBy?: keyof TData;
  defaultSortDirection?: SortOrderEnum;
  sortDir?: SortOrderEnum;
  onSortBy?: (sortBy: keyof TData, sortDir: SortOrderEnum) => void;
} & (
  | {
      children: TableChildren<TData> | TableChildren<TData>[];
    }
  | { columns: ColumnDefinition<TData>[] }
);

export function DataTable<TData extends Record<string, unknown>>({
  data,
  className,
  sortDir,
  sortBy,
  defaultSortDirection = SortOrderEnum.DESC,
  onSortBy,
  ...childrenOrColumns
}: TableProps<TData>) {
  const columnDefinitions = useColumnsOrChildren({
    children:
      "children" in childrenOrColumns ? childrenOrColumns.children : undefined,
    columns:
      "columns" in childrenOrColumns ? childrenOrColumns.columns : undefined,
  });

  const classNames = getClassNames(className, "table");

  const handleSortBy = (newSortBy: keyof TData) => {
    if (!onSortBy) {
      return;
    }

    return onSortBy(
      newSortBy,
      sortBy !== newSortBy
        ? defaultSortDirection
        : sortDir === SortOrderEnum.ASC
          ? SortOrderEnum.DESC
          : SortOrderEnum.ASC,
    );
  };

  return (
    <table
      data-label="table"
      className={clsx("outside-table", classNames.table)}
    >
      <thead className={classNames.thead}>
        <tr className={clsx(classNames.tr, classNames.headRow)}>
          {columnDefinitions.map((column, index) => {
            return (
              <th
                key={`${column.accessor}-${index}`}
                className={clsx(
                  classNames.th,
                  column.columnClassName,
                  column.th,
                  column.isSortable ? "sortable" : "",
                )}
                onClick={
                  column.isSortable
                    ? () => handleSortBy(column.accessor)
                    : undefined
                }
              >
                <div className={"heading-wrapper"}>
                  <span>{column.header ?? column.accessor}</span>
                  {column.isSortable && (
                    <span
                      className={clsx(
                        "sort-icon",
                        defaultSortDirection === "asc" ||
                          (sortBy === column.accessor && sortDir === "asc")
                          ? "is-asc"
                          : "is-desc",
                      )}
                    >
                      <>&#8681;</>
                    </span>
                  )}
                </div>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody className={clsx(classNames.tbody)}>
        {data.map((row, rowIndex) => (
          <tr
            className={clsx(classNames.tr, classNames.bodyRow)}
            key={"id" in row ? (row.id as string) : rowIndex}
          >
            {columnDefinitions.map((column, colIndex) => {
              return (
                <td
                  key={`${column.accessor}-${colIndex}`}
                  className={clsx(classNames.td, column.td)}
                >
                  <div className={clsx(column.cellContentWrapperClassName)}>
                    {typeof column.value === "function"
                      ? column.value(row)
                      : ((column.value ?? row[column.accessor]) as ReactNode)}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

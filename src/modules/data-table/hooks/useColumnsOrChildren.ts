import { TableColumn } from "modules/data-table/components/TableColumn";
import type {
  ColumnDefinition,
  RowData,
  TableChildren,
} from "modules/data-table/types/type";
import { Children, isValidElement, type ReactElement, useMemo } from "react";

type Props<TData extends RowData> = {
  children?: TableChildren<TData> | TableChildren<TData>[];
  columns?: ColumnDefinition<TData>[];
};

export function useColumnsOrChildren<TData extends RowData>({
  children,
  columns,
}: Props<TData>): ColumnDefinition<TData>[] {
  return useMemo(() => {
    if (columns) {
      return columns;
    } else if (children) {
      return Children.toArray(children).map((child) => {
        if (
          (process.env.NODE_ENV !== "production" && !isValidElement(child)) ||
          (child as ReactElement).type !== TableColumn
        ) {
          throw new Error(
            "Table only accepts <TableColumn> elements as children.",
          );
        }
        const column = child as TableChildren<TData>;
        return column.props;
      });
    }

    return [];
  }, [children, columns]);
}

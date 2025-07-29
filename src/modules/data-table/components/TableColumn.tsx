import type { ColumnDefinition, RowData } from "modules/data-table/types/type";

export function TableColumn<TData extends RowData>(
  _props: ColumnDefinition<TData>,
) {
  // const columnHelper = createColumnHelper<TData>();
  //
  // // @ts-expect-error accessor type invalid it seems
  // const columnDef = columnHelper.accessor(accessor, other)

  return null;
}

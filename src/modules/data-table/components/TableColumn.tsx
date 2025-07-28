import type { ColumnDefinition } from "../types/type";

export function TableColumn<TData extends Record<string, unknown>>(
  _props: ColumnDefinition<TData>,
) {
  // const columnHelper = createColumnHelper<TData>();
  //
  // // @ts-expect-error accessor type invalid it seems
  // const columnDef = columnHelper.accessor(accessor, other)

  return null;
}

import type { Meta, StoryObj } from "@storybook/react";
import { DataTable } from "modules/data-table/components/DataTable";
import { TableColumn } from "modules/data-table/components/TableColumn";
import { SortOrderEnum } from "modules/search-query/types/SortOrder";

type User = {
  id: number;
  name: string;
  email: string;
  image: string;
};

const users: User[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  image: `https://placehold.co/50?text=U${i + 1}`,
}));

const meta: Meta<typeof DataTable> = {
  title: "app/modules/Table",
  component: DataTable,
};

export default meta;

type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  render: () => (
    <DataTable data={users}>
      <TableColumn<User> accessor={"id"} />
      <TableColumn<User>
        accessor={"name"}
        value={(user) => user.name.toLowerCase()}
      />
      <TableColumn<User> accessor={"email"} />
      <TableColumn<User>
        accessor={"image"}
        value={(user) => (
          <div>
            <img src={user.image} alt={user.name} />
          </div>
        )}
      />
    </DataTable>
  ),
};

export const WithColumns: Story = {
  render: () => (
    <DataTable
      data={users}
      defaultSortDirection={SortOrderEnum.ASC}
      columns={[
        {
          accessor: "id",
        },
        {
          accessor: "name",
          isSortable: true,
        },
        {
          accessor: "email",
          value: (user) => <a href={`mailto:${user.email}`}>{user.email}</a>,
        },
        {
          accessor: "image",
          value: (user) => (
            <div>
              <img src={user.image} alt={user.name} />
            </div>
          ),
        },
      ]}
    />
  ),
};

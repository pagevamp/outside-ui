import { SearchQueryProvider, Table } from "@rnt-lib/core";
import "@rnt-lib/core/styles.css";

export default function Home() {
  return (
    <div className="p-20 relative box-border flex flex-col gap-6">
      <h2>Welcome to the page!</h2>
      <div className="bg-green-600/20 backdrop-blur-2xl w-full min-h-20 rounded-md p-4 border-gray-200">
        <DataFetcher />
      </div>
    </div>
  );
}

async function DataFetcher() {
  return (
    <SearchQueryProvider>
      <UsersList data={[{ id: "1", name: "Anit Shrestha" }]} />
    </SearchQueryProvider>
  );
}

function UsersList({
  data,
}: {
  data: {
    id: string;
    name: string;
  }[];
}) {
  return <Table columns={[{ accessor: "id" }, { accessor: "name" }]} data={data} isLoading={false} />;
}

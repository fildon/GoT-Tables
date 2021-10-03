import React from "react";
import { useTable } from "react-table";
import { Character, requestCharacterPage } from "../api/characterAPI";
import { PaginationBar } from "./paginationBar";
import { emptyCell, loading } from "./characterTable.module.css";
import { FilterBar } from "./filterBar";

const EmptyCell = (): JSX.Element => <span className={emptyCell}>-</span>;

const PrettyArrayCell = ({ children }: { children: string[] }): JSX.Element => {
  const nonEmptyArrayContent = children.filter((child) => child.length > 0);
  if (nonEmptyArrayContent.length === 0) {
    return <EmptyCell />;
  }
  return (
    <>
      {nonEmptyArrayContent.map((child, key) => (
        <div key={key}>{child},</div>
      ))}
    </>
  );
};

const PrettyCell = ({
  children,
}: {
  children: string | string[];
}): JSX.Element => {
  if (Array.isArray(children)) {
    return <PrettyArrayCell>{children}</PrettyArrayCell>;
  }

  if (children.length === 0) {
    return <EmptyCell />;
  }

  return <span>{children}</span>;
};

type PrettyCharacter = {
  name: JSX.Element;
  gender: JSX.Element;
  culture: JSX.Element;
  born: JSX.Element;
  died: JSX.Element;
  titles: JSX.Element;
  aliases: JSX.Element;
  father: JSX.Element;
  mother: JSX.Element;
  spouse: JSX.Element;
  allegiances: JSX.Element;
  books: JSX.Element;
  povBooks: JSX.Element;
  tvSeries: JSX.Element;
  playedBy: JSX.Element;
  age: JSX.Element;
};

const mapToPrettyCharacters = (characters: Character[]): PrettyCharacter[] => {
  return characters.map(
    (character) =>
      Object.entries(character).reduce((acc, [key, value]) => {
        return { ...acc, [key]: <PrettyCell>{value}</PrettyCell> };
      }, {}) as PrettyCharacter
  );
};

export const CharacterTable = () => {
  const [characters, setCharacters] = React.useState<PrettyCharacter[]>([]);
  const [totalPages, setTotalPages] = React.useState(-1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPageNumber, setCurrentPageNumber] = React.useState(1);
  const [canNextPage, setCanNextPage] = React.useState(false);
  const [canPreviousPage, setCanPreviousPage] = React.useState(false);
  const [filters, setFilters] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setIsLoading(true);
    requestCharacterPage(currentPageNumber, filters)
      .then(({ characters, totalPages }) => {
        setCharacters(mapToPrettyCharacters(characters));
        setTotalPages(totalPages);
        setCanPreviousPage(currentPageNumber > 1);
        setCanNextPage(currentPageNumber < totalPages);
      })
      .finally(() => setIsLoading(false));
  }, [currentPageNumber, filters]);

  const columns: {
    Header: string;
    accessor: keyof Character;
  }[] = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Gender",
        accessor: "gender",
      },
      {
        Header: "Culture",
        accessor: "culture",
      },
      {
        Header: "Born",
        accessor: "born",
      },
      {
        Header: "Died",
        accessor: "died",
      },
      {
        Header: "Titles",
        accessor: "titles",
      },
      {
        Header: "Aliases",
        accessor: "aliases",
      },
      {
        Header: "Father",
        accessor: "father",
      },
      {
        Header: "Mother",
        accessor: "mother",
      },
      {
        Header: "Spouse",
        accessor: "spouse",
      },
      {
        Header: "Allegiances",
        accessor: "allegiances",
      },
      {
        Header: "Books",
        accessor: "books",
      },
      {
        Header: "POV Books",
        accessor: "povBooks",
      },
      {
        Header: "TV Series",
        accessor: "tvSeries",
      },
      {
        Header: "Played By",
        accessor: "playedBy",
      },
      {
        Header: "Estimated Age",
        accessor: "age",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: characters });

  return (
    <>
      <PaginationBar
        {...{
          currentPageNumber,
          setCurrentPageNumber,
          isLoading,
          canNextPage,
          canPreviousPage,
          totalPages,
        }}
      />
      <FilterBar isLoading={isLoading} setFilters={setFilters} />
      <table {...getTableProps()} className={isLoading ? loading : ""}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

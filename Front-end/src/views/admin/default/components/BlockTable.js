import {
    Flex,
    Table,
    Text,
    Th,
    Thead,
    Tbody,
    Td,
    Tr,
    Select,
  } from "@chakra-ui/react";
  import React, { useMemo } from "react";
  import {
    useGlobalFilter,
    useFilters,
    usePagination,
    useSortBy,
    useTable,
  } from "react-table";
  import Card from "components/card/Card";
  
  
  export default function BlockTable(props) {
    const { blocks } = props;
  
    // Define the columns for the table
    const columnsData = useMemo(() => [
      {
        Header: "Index",
        accessor: "Index",
      },
      {
        Header: "Hash",
        accessor: "Hash",
      },
      {
        Header: "Vin Size",
        accessor: "vin_sz",
      },
      {
        Header: "Vout Size",
        accessor: "vout_sz",
      },
    ], []);
  
    // Prepare the data
    const data = useMemo(() => blocks.map(block => ({
      "Index": block.index,
      "Hash": block.hash,
      "vin_sz": block.vin_sz,
      "vout_sz": block.vout_sz,
    })), [blocks]);
  
    // Initialize the table
    const tableInstance = useTable(
      {
        columns: columnsData,
        data,
        initialState: { pageSize: 10 },
      },
      useGlobalFilter,
      useFilters,
      useSortBy,
      usePagination
    );
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      canPreviousPage,
      canNextPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, pageSize },
    } = tableInstance;
  
    const handlePageSizeChange = (e) => {
      const newSize = Number(e.target.value);
      setPageSize(newSize);
    };

  
    return (
        <>
          <div style={{ marginBottom: '10px', width: '100%', textAlign: 'center' }}>
            <Select onChange={handlePageSizeChange} defaultValue={10}>
              <option value={10}>Show 10</option>
              <option value={20}>Show 20</option>
              <option value={30}>Show 30</option>
              <option value={50}>Show 50</option>
              <option value={80}>Show 80</option>
              <option value={100}>Show 100</option>
            </Select>
          </div>
      
          <Card direction='column' w='100%' px='0px' overflowX={{ sm: "scroll", lg: "hidden" }}>
            <Table {...getTableProps()} variant='simple'>
              <Thead>
                {headerGroups.map((headerGroup, index) => (
                  <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column, index) => (
                      <Th {...column.getHeaderProps(column.getSortByToggleProps())} key={index}>
                        {column.render("Header")}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                {page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <Tr {...row.getRowProps()} key={index}>
                      {row.cells.map((cell, index) => (
                        <Td {...cell.getCellProps()} key={index}>
                          {cell.render("Cell")}
                        </Td>
                      ))}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
      
            <div className="pagination">
              <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                {'<'}
              </button>
              {' '}
              <button onClick={() => nextPage()} disabled={!canNextPage}>
                {'>'}
              </button>
              {' '}
              <span>
                Page{' '}
                <strong>
                  {pageIndex + 1}
                </strong>{' '}
                of{' '}
                <strong>{Math.ceil(blocks?.length / pageSize)}</strong>
              </span>
            </div>
          </Card>
        </>
      );
      
  }
  
import {
  Flex,
  Table,
  Checkbox,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  SimpleGrid,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import {
  useGlobalFilter,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import moment from "moment"; // new import for time formatting
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";
import { NumberRangeColumnFilter, DateRangeColumnFilter } from "./tableFilters";
import { Select } from "@chakra-ui/react"; 



export default function CheckTable(props) {
  const { transactions } = props;

  // Define the columns for the table
  const columnsData = useMemo(() => [
    {
      Header: "Transaction Hash",
      accessor: "Transaction Hash",
    },
    {
      Header: "In/Out",
      accessor: "In/Out",
    },
    {
      Header: "Value",
      accessor: "Value",
      Filter: NumberRangeColumnFilter,
    },
    {
      Header: "Timestamp",
      accessor: "Timestamp",
      // Filter: DateRangeColumnFilter,
      // filter: 'between'
    },
  ], []);

  // Prepare the data
  const data = useMemo(() => transactions.map(tx => ({
    "Transaction Hash": tx.hash,
    "In/Out": tx.result < 0 ? "Out" : "In",
    "Value": Math.abs(tx.result / 100000000),
    "Timestamp": moment.unix(tx.time).format("MM/DD/YYYY, h:mm:ss a"),
  })), [transactions]);

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DateRangeColumnFilter,
    }),
    []
  )

  const filterTypes = React.useMemo(
    () => ({
      between: (rows, id, filterValues) => {
        let [startDate, endDate] = filterValues;
        if (!startDate && !endDate) return rows;
        if (startDate) startDate = new Date(startDate).getTime();
        if (endDate) endDate = new Date(endDate).getTime();
  
        return rows.filter(row => {
          const rowValue = new Date(row.values[id]).getTime();
          return (!startDate || rowValue >= startDate) && (!endDate || rowValue <= endDate);
        });
      },
    }),
    []
  );

  // Initialize table
  const tableInstance = useTable(
    {
      columns: columnsData,
      data,
      defaultColumn,
      filterTypes,
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
    setFilter,
    setPageSize,
    state: { pageIndex, pageSize }
  } = tableInstance;

  const handleFilterChange = (e, id) => {
    const value = e.target.value || undefined;
    setFilter(id, value);
  };

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
  };

  return (
    
    <>
    <div style={{
    border: '1px solid #ccc',
    padding: '20px',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px'
  }}>
    <div style={{ marginBottom: '10px', width: '100%', textAlign: 'center' }}>
      <label htmlFor="valueFilter">Filter By Value: </label>
      <input
        style={{ marginLeft: '10px', borderRadius: '10px', backgroundColor: 'lightgray' }}
        type="number"
        id="valueFilter"
        onChange={e => handleFilterChange(e, 'Value')}
      />
    </div>

    <div style={{ marginTop: '10px', width: '100%', textAlign: 'center' }}>
      <label htmlFor="timeFilter">Filter By Time: </label>
      <input
        style={{ marginLeft: '10px', borderRadius: '10px', backgroundColor: 'lightgray'}}
        type="date"
        id="timeFilter"
        onChange={e => handleFilterChange(e, 'Timestamp')}
      />
      </div>

      <div style={{ width: '35%', textAlign: 'center' }}>
        <Select onChange={handlePageSizeChange} defaultValue={10}>
          <option value={10}>Show 10</option>
          <option value={20}>Show 20</option>
          <option value={30}>Show 30</option>
          <option value={50}>Show 50</option>
          <option value={80}>Show 80</option>
          <option value={100}>Show 100</option>
        </Select>
      </div>
      
   </div>

   


    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Flex px='25px' justify='space-between' align='center'>
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          Transactions
        </Text>
        <Menu />
      </Flex>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}>
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'>
                    {column.render("Header")}
                  </Flex>
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
                  <Td
                    {...cell.getCellProps()}
                    key={index}
                    fontSize={{ sm: "14px" }}
                    minW={{ sm: "150px", md: "200px", lg: "auto" }}
                    borderColor='transparent'>
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
          <strong>{Math.ceil(transactions.length / pageSize)}</strong>
        </span>
      </div>
    </Card>
    </>
  );
  
}

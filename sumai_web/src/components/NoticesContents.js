import React, {useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

// Table
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import Collapse from '@material-ui/core/Collapse';

import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

//db
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
  button: {
      variant: 'contained',
      color: '#666',
      border: '1px solid #d4d4d4',
      width: '100%',
      height: '50px',
      fontSize: '15px',
      borderRadius: '0px',
      
      "&:hover": {
        fontWeight: "bold",
        background: "#ffffff",
        textDecorationLine: 'underline',
      },
    },
  subtitle: {
    fontSize: "18px",
    fontFamily: "NotoSansKR-Medium",
  },
  content: {
    fontSize: "14px",
    fontFamily: "NotoSansKR-Light",
    lineHeight: "25px",
  },
  table: {
    '& > *': {
      borderBottom: 'unset',
    },
    "&:hover > *": {
      backgroundColor: "WhiteSmoke",
    },
  },
  tablePagination: {
    margin: 0
  }
}));

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(page - 5);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(page + 5);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const handlePageClick = (event, page) => {
    onChangePage(page);
  };

  const currentPage = (page) => {
    let start=page-2>0? page-2: 0
    let end=start+5
    if(start+5>Math.max(0, Math.ceil(count / rowsPerPage))){
      end=Math.max(0, Math.ceil(count / rowsPerPage))
      start=end-5>0? end-5: 0
    }
    let pageList=[]
    for(let i=start; i<end; i++) {
      pageList=pageList.concat([i])
    }
    return pageList
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton 
      onClick={handleBackButtonClick} 
      disabled={page === 0} 
      aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      {currentPage(page).map((n, index) => {
        return(
          <Typography 
          style={{
            display: 'inline-block', 
            padding: '0 10px', 
            color: page===n? 'red':'black',}}
          onClick={(event) => handlePageClick(event, n)}
          component={IconButton} key={index}>
            {n+1}
          </Typography>
        )
      }
      )}
      
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function NoticesContents() {
  const classes = useStyles();
  const [selectId, setSelectId] = React.useState(-1)
  const [page, setPage] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [emptyRows, setEmptyRows] = React.useState(0)

  const handleChangePage = async (newPage) => {
    let end=Math.max(0, Math.ceil(count / rowsPerPage) - 1)
    if(newPage>end){
      await queryData(end)
      setPage(end)
    } else if(newPage<0){
      await queryData(0)
      setPage(0)
    } else {
      await queryData(newPage)
      setPage(newPage)
    }
  };
  const handleChangeRowsPerPage = (event) => {
    queryData(0, parseInt(event.target.value, 10))
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeSelectId = (newSelect) => {
    if (newSelect!==selectId) {
      setSelectId(newSelect)
    } else {
      setSelectId(-1)
    }
  }
  
  const queryData = async (page, rowsPPage=rowsPerPage) => {
    let t
    await axios.post('/api/notices/notices', {page, rowsPPage}).then((response) => {
      t=response.data.map(data => ({ ...data, date: data.date.split('T')[0]}))
      setRows(t)
    })
  }

  const mountFunc = async () => {
    const res = await axios.get('/api/notices/noticesCount');
    setCount(res.data[0]['COUNT(*)'])
    await queryData(0)
    
  }

  useEffect(() => {
    mountFunc()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    setEmptyRows(rowsPerPage - rows.length);
  }, [rows])
  
  return (
    <Box
    style={{
      display: 'flex',
      margin: '50px 0',
      minHeight: '500px'
    }}>
      <Box
      style={{
        flexGrow : 1,
      }}>
        <Typography className={classes.subtitle} onClick={() =>setPage(0)}>
        
          공지사항

        </Typography>
      </Box>
      <Box
      style={{
        flexGrow: 10,
        width: 0
      }}>
        <TableContainer >
          <Table aria-label="collapsible table"
          style={{
            width: '100%',
            borderTop: '1px solid black'
          }}>
            <TableHead>
              <TableRow>
                <TableCell align="center"
                style={{
                  width: '90%',
                }}>내용</TableCell>
                <TableCell align="center"
                style={{
                  minWidth: '100px'
                }}>등록일</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(0, rowsPerPage)
                : rows
              ).map((row, index) => {
                return (
                  <React.Fragment key={index}>
                      <TableRow className={classes.table}
                      onClick={
                        () => handleChangeSelectId(row.index)
                      }
                      style={{
                        backgroundColor: selectId===row.index ? 'WhiteSmoke': '',
                      }}
                      >
                        <TableCell component="th" scope="row" 
                        style={{
                          fontSize: '16px'
                        }}>
                          {row.title}
                        </TableCell>
                        <TableCell align="center">{row.date}</TableCell>
                      </TableRow>
                    <TableRow >
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
                        <Collapse in={selectId===row.index} timeout="auto" unmountOnExit>
                          <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div" dangerouslySetInnerHTML={{__html: row.content}}>
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 56 * emptyRows }}>
                  <TableCell colSpan={2} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>
                  <TablePagination 
                    classes={{
                      selectRoot: classes.tablePagination
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                    rowsPerPage={rowsPerPage}
                    component="div"
                    count={count}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                    labelRowsPerPage='페이지 당 개수'

                    labelDisplayedRows={({ from, to, count }) => ``}
                    SelectProps={{
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
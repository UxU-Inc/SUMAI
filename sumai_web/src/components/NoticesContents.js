import React, {useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


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
import useMediaQuery from '@material-ui/core/useMediaQuery';

//db
import axios from 'axios';

//redux
import {sendAct} from '../reducers/clientInfo'
import { useDispatch } from 'react-redux';



const useStyles = makeStyles((theme) => ({
  subtitle: {
    fontSize: "18px",
    fontFamily: "NotoSansKR-Medium",
  },
  table: {
    '& > *': {
      borderBottom: 'unset',
    },
    "&:hover > *": {
      backgroundColor: "WhiteSmoke",
    },
  },
  tablePaginationRoot: {
    overflow: 'hidden'
  },
  tablePagination: {
    margin: 0,
    padding: 0
  },
}));

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  page: {
    display: 'inline-block',
    padding: '0 10px',
  }
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const { count, page, rowsPerPage, onChangePage } = props;

  const currentPage = (page) => {
    return Array.from({length: 5}, (x, i) => i+page-2).filter((x) => 0 <= x && x <= count / rowsPerPage)
  }

  return (
    <Box className={classes.root}>
      <IconButton onClick={() => onChangePage(0)} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={() => onChangePage(page - 1)} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>

      {
        currentPage(page).map((n, index) => 
          <Typography 
            className={classes.page} style={{color: page===n? 'red':'black',}} onClick={() => onChangePage(n)} component={IconButton} key={index}
          >
            {n+1}
          </Typography>
        )
      }
      
      <IconButton onClick={() => onChangePage(page + 1)} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        <KeyboardArrowRight />
      </IconButton>
      <IconButton onClick={() => onChangePage(parseInt(count / rowsPerPage))} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

function useRows() {
  const [rows, setRows] = React.useState([])
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/api/notices/notices')
        setRows(response.data.map(row => ({index: row.index, title: '', content: '', date: ''})))
      } catch (e) {
        setRows([])
      }
    }
    fetchData()
  }, [])

  return rows
}

function useQueryData() {
  const rows = useRows()
  const count = rows.length
  const [loading, setLoading] = React.useState(false)

  const process = React.useCallback(async (requestedIndexs) => {
    const response = await axios.post('/api/notices/notices', {requestedIndexs})
    const providedRows=response.data.map(data => ({ ...data, date: data.date.split('T')[0]}))
    for(let i=0; i<providedRows.length; i++)
      rows[rows.findIndex(row => row.index === providedRows[i].index)]=providedRows[i]
  }, [rows])

  const requestRows = React.useCallback(async (start, end) => {
    if(rows.length) {
      setLoading(true)
      const requestedIndexs = rows.filter((v, i) => start <= i && i < end && v.date === '').map(row => row.index)
      if(requestedIndexs.length) {
        await process(requestedIndexs)
      }
      setLoading(false)
    }
  }, [rows, process])

  return [loading, rows, count, requestRows]
}

function NoticesTable(props) {
  const {matches} = props
  const classes = useStyles();

  const [selectId, setSelectId] = React.useState(-1)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, rows, count, requestRows] = useQueryData()
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

  const dispatch = useDispatch()

  const handleChangePage = React.useCallback(async (newPage) => {
    await requestRows(newPage*rowsPerPage, (newPage+1)*rowsPerPage)
    setPage(newPage)
  }, [rowsPerPage, requestRows]);

  const handleChangeRowsPerPage = React.useCallback(async (event) => {
    if(event.type==='change') {
      const value = event.target.value
      await requestRows(0, parseInt(value, 10))
      setPage(0)
      setRowsPerPage(parseInt(value, 10))
    }
  }, [requestRows]);

  const handleChangeSelectId = (newSelect) => {
    if (newSelect!==selectId) {
      setSelectId(newSelect)
      dispatch(sendAct(`notices - check ${newSelect}`))
    } else {
      setSelectId(-1)
    }
  }

  const handleScroll = React.useCallback(async (event) => {
    const currentScrollPercentage = () => (window.scrollY + window.innerHeight) / document.body.clientHeight * 100
    if(currentScrollPercentage() > 95) {
      await requestRows(0, rowsPerPage+5)
      setRowsPerPage(rowsPerPage+5)
    }
  }, [requestRows, rowsPerPage]);

  const mobInit = async () => {
    const currentScrollPercentage = () => (window.scrollY + window.innerHeight) / document.body.clientHeight * 100
    for(let i=0;currentScrollPercentage() > 95 && i < count; i+=5)  {
      await requestRows(0, i+5)
      setRowsPerPage(i+5)
    }
  };
  
  // mob scroll event
  useEffect(() => {
    if(!matches) {
      window.addEventListener("scroll", handleScroll)
      return ()=> window.removeEventListener("scroll", handleScroll)
    }
  }, [matches, handleScroll])

  // loading bar
  useEffect(() => {
    if(!loading) {
      document.getElementById('topLoadingBar').style.visibility='hidden'
    }else{
      document.getElementById('topLoadingBar').style.visibility='visible'
    }
  }, [loading])

  // rows init
  useEffect(() => {
    // mob
    if(!matches) {
      setPage(0)
      mobInit()
    // pc
    } else {
      if(rowsPerPage > 10)setRowsPerPage(5)
      document.documentElement.scrollTop = 0;
      requestRows(page*rowsPerPage, (page+1)*rowsPerPage)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, matches])

  const contents = rows.slice(page*rowsPerPage, (page+1)*rowsPerPage).filter(row => row.date !== '').map((row, index) =>
    <React.Fragment key={index}>
        <TableRow className={classes.table} onClick={() => handleChangeSelectId(row.index)} style={{backgroundColor: selectId===row.index ? 'WhiteSmoke': '',}}>
          <TableCell component="th" scope="row" style={{fontSize: '16px', width: '90%',}}>{row.title}</TableCell>
          <TableCell style={{align: "center", minWidth: '100px'}}>{row.date}</TableCell>
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
  )

  if(count === 0) return(
    <Box style={{display:"flex", justifyContent:"center", padding:'16px'}}>
      아직 공지사항이 없습니다.
    </Box>
  )

  if(!matches) return(
    <Table>
      <TableBody>
        {contents}
      </TableBody>
    </Table>
  )
  
  return(
    <TableContainer >
      <Table aria-label="collapsible table" style={{width: '100%', borderTop: '1px solid black'}}>
        <TableHead style={{display: matches?'table-header-group':'none'}}>
          <TableRow>
            <TableCell align="center" style={{width: '90%',}}>내용</TableCell>
            <TableCell align="center">등록일</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contents}
          {emptyRows > 0 && (
            <TableRow style={{ height: 56 * emptyRows }}>
              <TableCell colSpan={2} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter style={{overflow: 'hidden'}}>
          <TableRow>
            <TableCell colSpan={2}>
              {page >= 0 && (
                <TablePagination 
                  classes={{root: classes.tablePaginationRoot, selectRoot: classes.tablePagination, toolbar: classes.tablePagination}}
                  rowsPerPageOptions={[5,10]} rowsPerPage={rowsPerPage}
                  labelRowsPerPage={'페이지 당 개수'}
                  component="div" count={count} page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}

                  labelDisplayedRows={() => ``}
                  SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}/>
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}

export default function NoticesContents() {
  const theme = useTheme();
  const classes = useStyles();
  const matches = useMediaQuery(theme.breakpoints.up('md'));
  
  return (
    <Box
    style={{
      display: 'flex',
      margin: (matches?'50px 0':'')
    }}>
      {matches && (
        <Box
        style={{
          flexGrow : 1,
        }}>
          <Typography className={classes.subtitle}>
            공지사항
          </Typography>
        </Box>
      )}
      <Box
      style={{
        flexGrow: 10,
        width: 0
      }}>
        <NoticesTable matches={matches}/>
      </Box>
    </Box>
  );
}
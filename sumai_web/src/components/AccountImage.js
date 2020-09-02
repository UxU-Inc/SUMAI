import React, {useCallback} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import PhotoIcon from '@material-ui/icons/Photo';
import {useDropzone} from 'react-dropzone'
import FormData from 'form-data'
import axios from 'axios';
import { Typography } from '@material-ui/core';
import imageCompression from 'browser-image-compression';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function AccountImage(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [imgBase64, setImgBase64] = React.useState(props.imagesrc); // 파일 base64
  const [imgFile, setImgFile] = React.useState(null);	//파일	
  const [notImg, setNotImg] = React.useState(false);	
  const [imgContents, setImgContents] = React.useState('클릭 또는 이미지를 드래그');	//파일	
  const [isDelete, setIsDelete] = React.useState(false);	//파일	
  const [isLoading, setIsLoading] = React.useState(false);	//파일

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0]) {
      setIsLoading(true)
      if(acceptedFiles[0].type.indexOf("image/") === -1) {
        setNotImg(true)
        setImgBase64("");
        setImgFile(null); // 파일 상태 업데이트
      } else {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 300,
          useWebWorker: true
        }
        imageCompression(acceptedFiles[0], options)
          .then(function (compressedFile) {
            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
            
            imageCompression.getDataUrlFromFile(compressedFile).then((data) => {
              setIsLoading(false)
              setNotImg(false)
              setImgBase64(data)
              setImgFile(compressedFile); // write your own logic
            })
          }).catch(() => {
            setIsLoading(false)
            setImgBase64("");
            setImgFile(null);
            setImgContents("오류가 발생했습니다.")
          })
      }
    }
  }, [])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

  const handleClose = () => {
    props.onClose('');
  };

  const handleChange = () => {
    if(imgFile === null) {
      props.onClose('');
    } else {
      let data = new FormData();
      data.append('img', imgFile, imgFile.name);
      axios.post('/api/account/imageUpload/'+props.id, data, { headers: {
        'accept': 'application/json',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }}).then((data) => {
        props.onClose(data.data.image);
      }).catch(() => {
        setImgBase64("");
        setImgFile(null);
        setImgContents("오류가 발생했습니다.")
      })
    }
  };

  const handleDeleteOpen = () => {
    setIsDelete(true)
  };

  const handleDelete = () => {
    axios.get('/api/account/imageDelete/'+props.id).then(() => {
      props.onClose('delete');
    })
  };

  const handleDeleteClose = () => {
    setIsDelete(false)
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={true}
      >
        <DialogTitle>
          {"프로필 사진 선택"}
          {!isDelete && props.imagesrc !== "" && props.imagesrc === imgBase64? <Button onClick={handleDeleteOpen} style={{color: "#ba000d", position: 'absolute', right: theme.spacing(1),}}>
            삭제
          </Button> : null}
        </DialogTitle>
        {!isDelete? <DialogContent style={{borderTop: '1px solid #e0e0e0'}}>
          <Box {...getRootProps()} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" style={{height: "380px", width: "380px"}}>
              {imgBase64 === "" || notImg? 
                <PhotoIcon style={{ fontSize: 100 }}/> : 
                isLoading? <CircularProgress /> : <img src={imgBase64} alt="profileImage" />}
              <Typography style={{textAlign: "center"}}>{imgContents}</Typography>
            </Box>
            <input
              {...getInputProps()}
              accept="image/*"
              style={{ display: 'none' }}
              type="file"
            />
          </Box>
        </DialogContent> :
        <DialogContent style={{borderTop: '1px solid #e0e0e0'}}>
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" style={{height: "380px", width: "380px"}}>
              <img src={props.imagesrc} alt="profileImage"/>
              <Typography style={{textAlign: "center", color: "#ba000d"}}>삭제하시겠습니까?</Typography>
            </Box>
          </Box>
        </DialogContent>}
        {!isDelete? <DialogActions>
          <Button onClick={handleChange} color="primary">
            변경
          </Button>
          <Button autoFocus onClick={handleClose} color="primary">
            취소
          </Button>
        </DialogActions> :
        <DialogActions>
          <Button onClick={handleDelete} style={{color: "#ba000d"}}>
            삭제
          </Button>
          <Button autoFocus onClick={handleDeleteClose} color="primary">
            취소
          </Button>
        </DialogActions>}
      </Dialog>
    </div>
  );
}
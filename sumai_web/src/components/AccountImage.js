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

export default function AccountImage(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [imgBase64, setImgBase64] = React.useState(""); // 파일 base64
  const [imgFile, setImgFile] = React.useState(null);	//파일	
  const [imgContents, setImgContents] = React.useState('Drag & Drop');	//파일	
  
  const handleChangeFile = (event) => {
    let reader = new FileReader();

    reader.onloadend = () => {
      // 2. 읽기가 완료되면 아래코드가 실행됩니다.
      const base64 = reader.result;
      if (base64) {
        setImgBase64(base64.toString()); // 파일 base64 상태 업데이트
      }
    }
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
      if(event.target.files[0].type.indexOf("image/") === -1) {
        setImgBase64("");
        setImgFile(null); // 파일 상태 업데이트
      } else {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 300,
          useWebWorker: true
        }
        imageCompression(event.target.files[0], options)
          .then(function (compressedFile) {
            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
       
            setImgFile(compressedFile); // write your own logic
          }).catch(() => {
            setImgBase64("");
            setImgFile(null);
            setImgContents("오류가 발생했습니다.")
          })
      }
    }
  }

  const onDrop = useCallback(acceptedFiles => {
    let reader = new FileReader();

    reader.onloadend = () => {
      // 2. 읽기가 완료되면 아래코드가 실행됩니다.
      const base64 = reader.result;
      if (base64) {
        setImgBase64(base64.toString()); // 파일 base64 상태 업데이트
      }
    }
    if (acceptedFiles[0]) {
      reader.readAsDataURL(acceptedFiles[0]); // 1. 파일을 읽어 버퍼에 저장합니다.
      if(acceptedFiles[0].type.indexOf("image/") === -1) {
        setImgBase64("");
        setImgFile(null); // 파일 상태 업데이트
      } else {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 500,
          useWebWorker: true
        }
        imageCompression(acceptedFiles[0], options)
          .then(function (compressedFile) {
            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
       
            setImgFile(compressedFile); // write your own logic
          }).catch(() => {
            setImgBase64("");
            setImgFile(null);
            setImgContents("오류가 발생했습니다.")
          })
      }
    }
  }, [])
  const {getRootProps} = useDropzone({onDrop})

  const handleClose = () => {
    props.onClose('');
  };

  const handleChange = () => {
    if(imgFile === null) {
      props.onClose('');
    } else {
      let data = new FormData();
      data.append('img', imgFile, imgFile.name);
      axios.post('/api/account/imageUpload/'+props.email, data, { headers: {
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

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={true}
      >
        <DialogTitle>{"프로필 사진 선택"}</DialogTitle>
        <DialogContent style={{borderTop: '1px solid #e0e0e0'}}>
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" style={{minWidth: "300px", minHeight: "200px"}}>
            <Box {...getRootProps()}>
              {imgBase64 === ""? 
                <Box>
                  <PhotoIcon style={{ fontSize: 100 }}/>
                  <Typography style={{textAlign: "center"}}>{imgContents}</Typography>
                </Box> :
                <img src={imgBase64} alt="profileImage"></img>}
            </Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleChangeFile}
            />
            <label htmlFor="raised-button-file">
              <Button component="span">
                사진 선택
              </Button>
            </label> 
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleChange} color="primary">
            변경
          </Button>
          <Button autoFocus onClick={handleClose} color="primary">
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
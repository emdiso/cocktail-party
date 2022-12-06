import React, { useEffect } from 'react';
import QRCode from 'qrcode';
import { baseServerUrl } from '../axios.service';


interface ImageQRCodeProps {
  imageId: number;
}

const ImageQRCode = (props: ImageQRCodeProps) => {
  const [qrUrl, setQRUrl] = React.useState("");
  useEffect(()=> {
    if (qrUrl !== "") return;
    QRCode.toDataURL(`${baseServerUrl}/image/display?imageId=${props.imageId}`).then((value) => {
        setQRUrl(value);
      });
  }, [qrUrl]);

  return qrUrl ? (<img src={qrUrl} />) : (<div></div>);
};

export default ImageQRCode;
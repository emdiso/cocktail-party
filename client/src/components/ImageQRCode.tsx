import React from 'react';
import QRCode from 'qrcode';
import { baseServerUrl } from '../axios.service';


interface ImageQRCodeProps {
  imageId: number;
}

const ImageQRCode = (props: ImageQRCodeProps) => {
  const [qrUrl, setQRUrl] = React.useState("");
  QRCode.toDataURL(`${baseServerUrl}/image/display?imageId=${props.imageId}`).then((value) => {
    console.log(value);
    setQRUrl(value);
  });

  return qrUrl ? (<img src={qrUrl} />) : (<div></div>);
};

export default ImageQRCode;
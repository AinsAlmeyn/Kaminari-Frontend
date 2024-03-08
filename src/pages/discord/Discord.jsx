import React, { useEffect, useState } from 'react';
import { Row, Col } from "reactstrap";
import { Button, TextBox, SelectBox, } from 'devextreme-react';
import ReactPaginate from 'react-paginate';
import { RangeSlider } from 'devextreme-react/range-slider';
import { usePostRequestSyncPromise } from "../../global/GlobalFetch";
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.js';


export default function Discord() {
    return (
        <div>
            <iframe
                src={"https://discord.com/widget?id=YOUR ID&theme=dark"}
                width="100%"
                height={"100%"}
                style={{
                    border: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                allowTransparency={true}
                allowFullScreen={true}
            ></iframe>
        </div>
    )
}

import React, { useCallback, useState } from 'react';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import { useSelector, useDispatch } from 'react-redux';
import { setMessageModalShow, setMessageModalBody, setMessageModalType, setMessageModalonCancel, setMessageModalonOK } from '../../Slices';
export default function MessageModal() {

    const messageModalShow = useSelector(state => state.app.messageModalShow);
    const messageModalBody = useSelector(state => state.app.messageModalBody);

    const dispatch = useDispatch();

    function hideInfo() {
        dispatch(setMessageModalShow(false));
    }

    const getCloseButtonOptions = useCallback(() => ({
        text: 'Tamam',
        stylingMode: 'contained',
        type: 'normal',
        onClick: hideInfo,
    }), [hideInfo]);

    return (
        <div>
            <Popup
                visible={messageModalShow}
                position={Position.center}
                dragEnabled={false}
                hideOnOutsideClick={false}
                showCloseButton={false}
                showTitle={true}
                title="Info"
                container=".dx-viewport"
                width={"20%"}
                height={"auto"}
            >
                <ToolbarItem
                    widget="dxButton"
                    toolbar="bottom"
                    location="after"
                    options={getCloseButtonOptions()}
                />
                <p>
                    {messageModalBody}
                </p>
            </Popup>
        </div>
    )
}